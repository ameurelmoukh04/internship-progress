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
    #[Route('/tasks', name:'tasks')]
    public function index(EntityManagerInterface $em,SerializerInterface $serializer):Response
    {
        $repository = $em->getRepository(Task::class);
        $tasks = $repository->findAll();
        return $this->render('homePage.html.twig', [
            'tasks'=> $tasks
        ]);
    }

    #[Route('/tasks-api')]
    public function index2(EntityManagerInterface $em,SerializerInterface $serializer):Response
    {
        $repository = $em->getRepository(Task::class);
        $tasks = $repository->findAll();
        $json = $serializer->serialize($tasks, 'json', ['groups' => 'task:read']);
        //$newJson = json_encode(['items' => $tasks]);
        return new JsonResponse(['items' => json_decode($json)],200);
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
        $task->setImage($request->request->get('image'));
        $task->setStatus('Pending');
        
        $em->persist($task);
        $em->flush();

        return new JsonResponse(['status' => 201, 'message' =>'created']);
    }
    
    #[Route('/tasks/{id}/delete',name:'destroy-task')]
    public function destroy(int $id, EntityManagerInterface $em)
    {
        $repository = $em->getRepository(Task::class);
        $task = $repository->find($id);
        if(!$task){
            return $this->createNotFoundException('task not found');
        }
        $em->remove($task);
        $em->flush();
        return new JsonResponse(['status' => 200, 'message' => 'Deleted']);
    }
    
    #[Route('/tasks/{id}/update',name:'complete-task')]
    public function toggleStatus(int $id,EntityManagerInterface $em){
        $repository = $em->getRepository(Task::class);
        $task = $repository->find($id);
        
        if(!$task){
            return new Response('Task Not Found',404);
        }
        if($task->getStatus() == 'Completed'){
            $task->setStatus('Pending');
        }else{
            $task->setStatus('Completed');
        }
        $em->flush();
        return new Response('Updated',200);
    }

    #[Route('/posts',name:'posts',methods:['POST','GET'])]
    public function ajaxTest(){
        return $this->json(['items' => ['item1','item2'],'status' => 200]);
    }
    
}