<?php

namespace App\Repository;

use App\Entity\Marker;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Math;
use Doctrine\Persistence\ManagerRegistry;

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
     * @param float $latitude
     * @param float $longitude
     * @param float $radius
     * @return array
     */
    public function findNearestMarkers(
        float $latitude,
        float $longitude,
        float $radius
    ): array {
        $radiusInMeters = round($radius);

        return $this->createQueryBuilder('m')
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
            ->setMaxResults(50)
            ->getQuery()
            ->getResult();
    }
}
