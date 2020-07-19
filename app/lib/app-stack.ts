import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import {SubnetType} from "@aws-cdk/aws-ec2/lib/vpc";
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as autoscaling from '@aws-cdk/aws-autoscaling';

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
      clusterName: this.stackName + "-" + "Cluster"
    });

    cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
      instanceType: new ec2.InstanceType("t2.nano"),
      desiredCapacity: 2,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE,
      }
    });

//     // Create the load balancer in a VPC. 'internetFacing' is 'false'
// // by default, which creates an internal load balancer.
// const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
//   vpc,
//   internetFacing: true
// });

// // Add a listener and open up the load balancer's security group
// // to the world.
// const listener = lb.addListener('Listener', {
//   port: 80,

//   // 'open: true' is the default, you can leave it out if you want. Set it
//   // to 'false' and use `listener.connections` if you want to be selective
//   // about who can access the load balancer.
//   open: true,
// });

  }
}
