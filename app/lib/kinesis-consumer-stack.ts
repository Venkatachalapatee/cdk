import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import {EcsOptimizedImage} from '@aws-cdk/aws-ecs';
import * as autoscaling from '@aws-cdk/aws-autoscaling';

export class KinesisConsumerStack extends cdk.Stack {

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

    // Or add customized capacity. Be sure to start the Amazon ECS-optimized AMI.
    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc,
      instanceType: new ec2.InstanceType('t2.nano'),
      machineImage: EcsOptimizedImage.amazonLinux(),
      desiredCapacity: 3,
      minCapacity:1,
      autoScalingGroupName: this.stackName + 'Cluster' + 'AutoScalingGroup',


    });

    autoScalingGroup.scaleOnMetric('ScaleToCPU', {
      metric: cluster.metricCpuReservation(),
      scalingSteps: [
        {upper: 20, change: -1},
        {lower: 50, change: +1},
        {lower: 70, change: +3},
      ],

      // Change this to AdjustmentType.PERCENT_CHANGE_IN_CAPACITY to interpret the
      // 'change' numbers before as percentages instead of capacity counts.
      adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
    });

    autoScalingGroup.scaleOnMetric('ScaleToMemory', {
      metric: cluster.metricMemoryReservation(),
      scalingSteps: [
        {upper: 20, change: -1},
        {lower: 50, change: +1},
        {lower: 70, change: +3},
      ],

      // Change this to AdjustmentType.PERCENT_CHANGE_IN_CAPACITY to interpret the
      // 'change' numbers before as percentages instead of capacity counts.
      adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
    });

    cluster.addAutoScalingGroup(autoScalingGroup);


  }
}
