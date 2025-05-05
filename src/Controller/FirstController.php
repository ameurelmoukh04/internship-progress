<?php
namespace App\Controller;

use App\Entity\Subscriber;
use App\Form\SubscriberForm;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FirstController extends AbstractController{
#[Route('/test', name:'test-url',defaults:['id'=>0])]

public function index(Request $request)
{
    $subscriber = new Subscriber();
    $form = $this->createForm(SubscriberForm::class,$subscriber);

    $form->handleRequest($request);

    if($form->isSubmitted() && $form->isValid()){
        $name = $form->getData()->getName();
        $age = $form->getData()->getAge();
        return $this->redirectToRoute('success',[
            'name' => $name,
            'age' => $age
        ]);
    }

    return $this->render('first_template.html.twig', [
        'form' => $form->createView(),
    ]);
}

#[Route('/success/{name}',name:'success')]
public function success(Request $request){
    $name = $request->query->get('name');
    $age = $request->query->get('age');
    return $this->render('success.html.twig',[
        'name'=> $name,
        'age'=> $age,
    ]);
}

}