<?php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController{
    #[Route('/api/register',methods:['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $em,
        ValidatorInterface $validator)
        {
        $data = json_decode($request->getContent(),true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        if(!$email || !$password){
            return new JsonResponse(['error' => 'wrong crediantials'],422);
        }
        $existing_user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

        if($existing_user){
            return new JsonResponse(['error' => 'email already exist'],422);
        }
        $user = new User();
        $errors = $validator->validate($user);
        if(count($errors) > 0){
            return new JsonResponse(['error' => $errors],422);
        }

        $user->setEmail($email);
        $hashedPassword = $passwordHasher->hashPassword($user,$password);
        $user->setPassword($hashedPassword);


        $em->persist($user);
        $em->flush();

        return new JsonResponse([
            'status' => 201,
            'message' => 'created Successfuly',
            'email' => $user->getEmail()
        ],201);

    }
    #[Route('/api/login', methods:['POST'])]
    public function login(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
        ){
        $data = json_decode($request->getContent());
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if(!$email || !$password){
            return new JsonResponse(['error' => 'data not valide'],422);
        }

        $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

        if(!$user || !$passwordHasher->isPasswordValid($user,$password)){
            return new JsonResponse([
                'message' => 'invalid Crdentials'
            ],401);
        }

        return new JsonResponse([
            'status' => 200,
            'message' => 'logged in successfully',
            'user' => $user
        ],200);
        

    }
}