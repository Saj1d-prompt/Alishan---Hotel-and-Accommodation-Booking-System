<?php

namespace App\Enums;

enum ContractType: string
{
    case MONTHLY = 'monthly';
    case SEMESTER = 'semester';
    case YEARLY = 'yearly';
}