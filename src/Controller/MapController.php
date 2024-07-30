<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class MapController extends AbstractController
{
    #[Route('/map', name: 'map')]
    public function index(): Response
    {
        $user = $this->getUser();

        if ($user) {
            return $this->render('map/map.html.twig', [
                'controller_name' => 'MapController',
                'map_token' => $this->getParameter('map_token'),
                'is_editor' => false
            ]);
        } else {
            return $this->redirectToRoute('login');
        }
    }
}
