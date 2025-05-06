<?php
namespace App\Controller;

use App\Entity\Task;
use Doctrine\DBAL\Types\JsonType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class TaskController extends AbstractController{
    #[Route('tasks', name:'tasks')]
    public function index(EntityManagerInterface $em,SerializerInterface $serializer):Response
    {
        $repository = $em->getRepository(Task::class);
        $tasks = $repository->findAll();

        return $this->render('homePage.html.twig', [
            'tasks'=> $tasks
        ]);
    }

    #[Route('/new-form',name:'new-form',methods:['GET'])]
    public function new_form(){
        return $this->render('new.html.twig');
    }

    #[Route('/add-task',name:'add-task',methods:['POST'])]
    public function store(Request $request, EntityManagerInterface $em):Response
    {
        $task = new Task;
        $task->setName($request->request->get('name'));
        $task->setDetails($request->request->get('details'));
        $task->setStatus('pending');

        $em->persist($task);
        $em->flush();
        return $this->redirectToRoute('tasks');
    }

    public function destroy(int $id, EntityManagerInterface $em)
    {
        $em = 
    }

}