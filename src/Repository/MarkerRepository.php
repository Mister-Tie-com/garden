<?php

namespace App\Repository;

use App\Entity\Marker;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends ServiceEntityRepository<Marker>
 */
class MarkerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Marker::class);
    }

    /**
     * @param UserInterface $user
     * @param float $latitude
     * @param float $longitude
     * @param float $radius
     * @param bool $isAdmin
     * @return array
     */
    public function findNearestMarkers(
        UserInterface  $user,
        float $latitude,
        float $longitude,
        float $radius,
        bool $isAdmin
    ): array {
        $radiusInMeters = round($radius);

        $queryBuilder = $this->createQueryBuilder('m')
            ->select('m')
            ->addSelect('(
            6371 * acos(
                cos(radians(:latitude)) * cos(radians(m.latitude)) *
                cos(radians(m.longitude) - radians(:longitude)) +
                sin(radians(:latitude)) * sin(radians(m.latitude))
            )
        ) AS HIDDEN distance')
            ->having('distance <= :radius')
            ->setParameter('latitude', $latitude)
            ->setParameter('longitude', $longitude)
            ->setParameter('radius', $radiusInMeters)
            ->orderBy('distance', 'ASC')
            ->setMaxResults(50);

        if (!$isAdmin) {
            $queryBuilder
                ->andWhere('m.user = :user')
                ->setParameter('user', $user);
        }

        return $queryBuilder->getQuery()->getResult();
    }
}
