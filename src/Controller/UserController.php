<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    #[Route('/admin/users', name: 'admin_user_list')]
    public function listUsers(EntityManagerInterface $entityManager): Response
    {
        $users = $entityManager->getRepository(User::class)
            ->createQueryBuilder('u')
            ->getQuery()
            ->getResult();

        return $this->render('admin/users/list.html.twig', [
            'users' => $users,
        ]);
    }

    #[Route('/admin/users/edit/{id}', name: 'admin_user_edit')]
    public function editUser(
        User $user,
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordEncoder
    ): Response {
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user->setPassword(
                $passwordEncoder->hashPassword($user, $user->getPassword())
            );
            $entityManager->persist($user);
            $entityManager->flush();

            $this->addFlash('success', 'User updated successfully.');
            return $this->redirectToRoute('admin_user_list');
        }

        return $this->render('admin/users/edit.html.twig', [
            'form' => $form->createView(),
            'user' => $user,
        ]);
    }

    #[Route('/admin/users/add', name: 'admin_user_add')]
    public function addUser(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordEncoder
    ): Response {
        $user = new User();

        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user->setPassword(
                $passwordEncoder->hashPassword($user, $user->getPassword())
            );

            $entityManager->persist($user);
            $entityManager->flush();

            $this->addFlash('success', 'User added successfully.');
            return $this->redirectToRoute('admin_user_list');
        }

        return $this->render('admin/users/add.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/admin/users/delete/{id}', name: 'admin_user_delete')]
    public function deleteUser(User $user, EntityManagerInterface $entityManager): Response
    {
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            $this->addFlash('error', 'Admin user cannot be deleted.');
            return $this->redirectToRoute('admin_user_list');
        }

        $entityManager->remove($user);
        $entityManager->flush();

        $this->addFlash('success', 'User deleted successfully.');
        return $this->redirectToRoute('admin_user_list');
    }
}
