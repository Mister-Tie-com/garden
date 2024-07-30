<?php

namespace App\Controller;

use App\Entity\Marker;
use App\Repository\MarkerRepository;
use App\Repository\MarkerTypeRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class MarkerController extends AbstractController
{
    private MarkerRepository $markerRepository;

    public function __construct(MarkerRepository $markerRepository)
    {
        $this->markerRepository = $markerRepository;
    }
    #[Route('/api/markers', name: 'get_markers', methods: ['GET'])]
    public function getMarkers(
        Request $request
    ): JsonResponse {
        $data = [];
        $latitude = $request->query->get('latitude');
        $longitude = $request->query->get('longitude');
        $radius = $request->query->get('radius');

        if (!empty($latitude) && !empty($longitude)) {
            $markers = $this->markerRepository->findNearestMarkers(
                $latitude,
                $longitude,
                $radius
            );
        } else {
            $markers = $this->markerRepository->findAll();
        }

        foreach ($markers as $marker) {
            $data[] = [
                'id' => $marker->getId(),
                'title' => $marker->getTitle(),
                'description' => $marker->getDescription(),
                'type_id' => $marker->getTypeId(),
                'photo' => $marker->getPhoto(),
                'link' => $marker->getPhoto(),
                'createdAt' => $marker->getCreatedAt(),
                'latitude' => $marker->getLatitude(),
                'longitude' => $marker->getLongitude(),
            ];
        }

        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route('/api/markers', name: 'create_marker', methods: ['POST'])]
    public function createMarker(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $marker = new Marker();
        $marker->setLatitude($data['latitude']);
        $marker->setLongitude($data['longitude']);
        $marker->setTitle($data['title'] ?? '');
        $marker->setDescription($data['description'] ?? '');
        $marker->setTypeId($data['type_id'] ?? null);
        $marker->setPhoto($data['photo'] ?? '');
        $marker->setLink($data['link'] ?? '');
        $marker->setCreatedAt(new DateTime());

        $em->persist($marker);
        $em->flush();

        $response = [
            'id' => $marker->getId(),
            'title' => $marker->getTitle(),
            'description' => $marker->getDescription(),
            'longitude' => $marker->getLongitude(),
            'latitude' => $marker->getLatitude(),
            'type' => $marker->getTypeId(),
            'photo' => $marker->getPhoto(),
            'link' => $marker->getLink(),
            'created_at' => $marker->getCreatedAt(),
        ];

        return new JsonResponse($response, Response::HTTP_OK);
    }

    #[Route('/api/markers/{id}', name: 'update_marker', methods: ['PUT'])]
    public function updateMarker(
        int $id,
        Request $request,
        MarkerRepository $markerRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $marker = $markerRepository->find($id);

        if (!$marker) {
            $response = [
                'error' => 'Marker not found'
            ];
            return new JsonResponse($response, Response::HTTP_NOT_FOUND);
        }

        $marker->setLatitude($data['latitude']);
        $marker->setLongitude($data['longitude']);
        $marker->setTitle($data['title']);
        $marker->setDescription($data['description'] ?? null);
        $marker->setTypeId($data['type_id'] ?? null);
        $marker->setPhoto($data['photo'] ?? null);
        $marker->setLink($data['link'] ?? null);

        $em->flush();

        $response = [
            'message' => sprintf('Marker %s : updated', $id),
            'success' => true
        ];

        return new JsonResponse($response, Response::HTTP_OK);
    }

    #[Route('/api/markers/{id}', name: 'delete_marker', methods: ['DELETE'])]
    public function deleteMarker(
        int $id,
        MarkerRepository $markerRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $marker = $markerRepository->find($id);

        if (!$marker) {
            return $this->json(['error' => 'Marker not found'], 404);
        }

        $em->remove($marker);
        $em->flush();

        $response = [
            'message' =>  sprintf('Marker %s : deleted', $id),
            'success' => true
        ];

        return new JsonResponse($response, Response::HTTP_OK);
    }

    #[Route('/api/marker/types', name: 'api_marker_types', methods: ['GET'])]
    public function getMarkerTypes(MarkerTypeRepository $markerTypeRepository): JsonResponse
    {
        $markerTypes = $markerTypeRepository->findAll();

        $data = [];
        foreach ($markerTypes as $type) {
            $data[] = [
                'id' => $type->getId(),
                'name' => $type->getName(),
                'description' => $type->getDescription(),
            ];
        }

        return new JsonResponse($data);
    }
}
