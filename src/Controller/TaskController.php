<?php
namespace App\Controller;

use App\Entity\Task;
use Doctrine\DBAL\Types\JsonType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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

    #[Route('/add-task',name:'add-task',methods:['POST'])]
    public function store(Request $request, EntityManagerInterface $em){
        $task = new Task;
        $task->setName('second Task');
        $task->setDetails('second Task Details');
        $task->setStatus('pending');
        $em->persist($task);
        $em->flush();
    }

}