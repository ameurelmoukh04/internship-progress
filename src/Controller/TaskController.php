<?php

namespace App\Controller;

use App\Entity\Task;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class TaskController extends AbstractController
{
    private $appKernel;
    public function __construct(KernelInterface $appkernel)
    {
        $this->appKernel = $appkernel;
    }
    
    #[Route('/tasks', name: 'tasks')]
    public function index(EntityManagerInterface $em, SerializerInterface $serializer): Response
    {
        $repository = $em->getRepository(Task::class);
        $tasks = $repository->findAll();
        return $this->render('homePage.html.twig', [
            'tasks' => $tasks
        ]);
    }

    #[Route('/tasks-api')]
    public function index2(EntityManagerInterface $em, SerializerInterface $serializer): Response
    {
        $repository = $em->getRepository(Task::class);
        $tasks = $repository->findAll();
        $json = $serializer->serialize($tasks, 'json', ['groups' => 'task:read']);
        //$newJson = json_encode(['items' => $tasks]);
        return new JsonResponse(['items' => json_decode($json)], 200);
    }


    #[Route('/add-task', name: 'add-task', methods: ['POST'])]
    public function store(Request $request, EntityManagerInterface $em): Response
    {
        $task = new Task;
        $task->setName($request->request->get('name'));
        $task->setDetails($request->request->get('details'));
        $task->setStatus('Pending');

        $uploadedFile = $request->files->get('image');

        $filename = date("Y-m-d") . $uploadedFile->getClientOriginalName();
        dump($filename);

        $task->setImage($filename);

        $uploadedFile->move($this->getParameter('upload_directory'), $filename);
        $em->persist($task);
        $em->flush();
        return new JsonResponse([
            'status' => 201,
            'message' => 'Created'
           ]);
    }

    #[Route('/tasks/{id}/delete', name: 'destroy-task',methods:['DELETE'])]
    public function destroy(int $id, EntityManagerInterface $em)
    {
        $filesystem = new Filesystem();
        $repository = $em->getRepository(Task::class);
        $task = $repository->find($id);
        $path=$this->getParameter("upload_directory").'/'.$task->getImage();
        if (!$task) {
            return new JsonResponse(['status' => 404, 'message' => 'Not Found']);
        }
        $em->remove($task);
        $filesystem->remove($path);
        $em->flush();
        return new JsonResponse([
         'status' => 200,
         'message' => 'Deleted',
         'path' => $path
        ]);
    }

    #[Route('/tasks/{id}/update', name: 'complete-task')]
    public function toggleStatus(int $id, EntityManagerInterface $em)
    {
        $repository = $em->getRepository(Task::class);
        $task = $repository->find($id);

        if (!$task) {
            return new Response('Task Not Found', 404);
        }
        if ($task->getStatus() == 'Completed') {
            $task->setStatus('Pending');
        } else {
            $task->setStatus('Completed');
        }
        $em->flush();
        return new Response('Updated', 200);
    }

    
}
