#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { EcommerceNestjsAwsEcsFargateCdkStack } from '../lib/ecommerce-nestjs-aws-ecs-fargate-cdk-stack';
import { EcrStack } from '../lib/ecr-stack';

const app = new cdk.App();

const tagsInfra = {
  cost: 'EcommerceInfra',
  team: 'SiecolaCode',
};

const env: cdk.Environment = {
  account: '500294431003',
  region: 'us-east-1',
};

const newStack = new EcrStack(app, 'Ecr', {
  tags: tagsInfra,
  env: env,
});
