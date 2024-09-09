<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email', TextType::class, [
                'disabled' => false,
                'attr' => [
                    'class' => 'custom-input',
                    'placeholder' => 'Enter your new email',
                ],
            ])
            ->add('roles', ChoiceType::class, [
                'choices' => [
                    'Client' => 'ROLE_CLIENT',
                    'User' => 'ROLE_USER',
                    'Admin' => 'ROLE_ADMIN',
                ],
                'multiple' => true,
                'expanded' => true,
                'attr' => [
                    'class' => 'custom-input',
                ],
            ])
            ->add('password', PasswordType::class, [
                'mapped' => true,
                'attr' => [
                    'class' => 'custom-input',
                    'placeholder' => 'Change password',
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'attr' => [
                'class' => 'custom-form'
            ],
        ]);
    }
}
