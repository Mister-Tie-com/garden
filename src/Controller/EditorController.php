<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class EditorController extends AbstractController
{
    #[Route('/editor', name: 'editor')]
    public function index(): Response
    {
        $user = $this->getUser();

        if ($user) {
            return $this->render('map/map.html.twig', [
                'controller_name' => 'EditorController',
                'map_token' => $this->getParameter('map_token'),
                'is_editor' => true
            ]);
        } else {
            return $this->redirectToRoute('login');
        }
    }
}
