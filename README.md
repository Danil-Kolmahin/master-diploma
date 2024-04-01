# Secret Management System
> This repository contains the source code of the master's thesis on the topic **"Method of managing confidential data in software development"**.

## Definition
The purpose of this work was to propose a new approach to determining the location of "secrets" in the modern software development process, which includes creating an application that will provide the ability to store secrets, define different values of secrets for different environments as needed, configure the hierarchy and dependency of secrets in one from one (also if necessary). Also, the service should provide an API for using secrets in user applications, update secrets in the application when the secrets database changes, define a set of mandatory and optional secrets for a specific application.

## Aspiration
This idea came from my work as a web developer on a project with a stack (NestJS, Typescript, nx, Jenkins, k8s, helm, docker), I noticed that there are several sources of truth for secrets such as .env files, helm settings, itself an application that, by the features of its work, also clearly or not determines the necessary secrets.

## Novelty of this work
I justify the novelty of the work by the absence, as far as I know, of systems that would offer, firstly, to completely separate secrets from the rest of the system, and secondly, to declare the necessary secrets on the side of the secret manager and not the application. Such a system, which would also be free to use, and would not require interaction with the cloud.

## Details
The details of the system under development can be learned from the backlog [here](./docs/backlog/).
