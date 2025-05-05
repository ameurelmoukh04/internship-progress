<?php
namespace App\Controller;

use App\Entity\Message;
use App\Entity\Subscriber;
use App\Form\MessageForm;
use App\Form\SubscriberForm;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ContactController extends AbstractController
{
    #[Route('/contact-us', name: 'contact-us')]
    public function index(Request $request, EntityManagerInterface $entityManager): Response
    {
        $message = new Message();

        $form = $this->createForm(MessageForm::class, $message);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            //dd($message);
            $entityManager->persist($message);
            $entityManager->flush();

            return new Response('we recived your message dear user '. $message->getName());
        }

        return $this->render('message.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/success', name: 'success')]
    public function success(Subscriber $subscriber): Response
    {
        return $this->render('success.html.twig', [
            'subscriber' => $subscriber,
        ]);
    }
}
