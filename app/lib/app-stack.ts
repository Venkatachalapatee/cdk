import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import {SubnetType} from "@aws-cdk/aws-ec2/lib/vpc";

export class AppStack extends cdk.Stack {

  get stackName(): string {
    return 'App';
  }

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // The code that defines your stack goes here
    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE,
        },
      ]
    });

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
    });

    cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
      instanceType: new ec2.InstanceType("t2.xlarge"),
      desiredCapacity: 3,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE,
      }
    });

  }
}
