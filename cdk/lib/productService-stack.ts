import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

interface ProductsServiceStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  cluster: ecs.Cluster;
  nlb: elbv2.NetworkLoadBalancer;
  alb: elbv2.ApplicationLoadBalancer;
  repository: ecr.Repository;
}

export class ProductsServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ProductsServiceStackProps) {
    super(scope, id, props);

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      'TaskDefinition',
      {
        cpu: 512,
        memoryLimitMiB: 1024,
        family: 'products-service',
      }
    );

    const logDriver = ecs.LogDriver.awsLogs({
      logGroup: new logs.LogGroup(this, 'LogGroup', {
        logGroupName: 'ProductsService',
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        retention: logs.RetentionDays.ONE_MONTH,
      }),
      streamPrefix: 'ProductsService',
    });

    taskDefinition.addContainer('ProductsServiceContainer', {
      image: ecs.ContainerImage.fromEcrRepository(props.repository, '1.0.0'),
      containerName: 'productsService',
      logging: logDriver,
      portMappings: [
        {
          containerPort: 8080,
          protocol: ecs.Protocol.TCP,
        },
      ],
    });
  }
}
