#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {AppStack} from '../lib/app-stack';

const app = new cdk.App();
new AppStack(app, 'AppStack', {
    env: {region: "us-east-1"},
    tags: {'billing': '123'}

});
