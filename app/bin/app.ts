#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {KinesisConsumerStack} from '../lib/kinesis-consumer-stack';

const app = new cdk.App();
new KinesisConsumerStack(app, 'AppStack', {
    env: {region: "us-east-1", account: '576208314879'},
    tags: {'billing': '123'}

});
