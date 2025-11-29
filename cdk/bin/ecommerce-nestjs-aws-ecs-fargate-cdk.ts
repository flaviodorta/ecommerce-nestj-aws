#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { EcrStack } from '../lib/ecr-stack';
import { VpcStack } from '../lib/vpc-stack';
import { ClusterStack } from '../lib/cluster-stack';
import { LoadBalancerStack } from '../lib/lb-stack';

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

const vpcStack = new VpcStack(app, 'Vpc', {
  env: env,
  tags: tagsInfra,
});

const lbStack = new LoadBalancerStack(app, 'LoadBalancer', {
  vpc: vpcStack.vpc,
  env: env,
  tags: tagsInfra,
});

lbStack.addDependency(vpcStack);

const clustStack = new ClusterStack(app, 'Cluster', {
  vpc: vpcStack.vpc,
  env: env,
  tags: tagsInfra,
});

clustStack.addDependency(vpcStack);
