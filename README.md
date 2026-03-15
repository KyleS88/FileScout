# FileScout

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](#)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Models-FFD21E?style=for-the-badge)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

FileScout is a smart file management tool designed to help you find the exact image you need through the power of semantic search. Built on top of FastAPI and Redis Stack, it leverages advanced transformer models to map images and text queries to a shared vector space, allowing for intuitive, context-aware image retrieval.

I have provided a live demonstration of the application. For a hands-on experience, please visit: **[https://huggingface.co/spaces/KyleS88/FileScout](https://huggingface.co/spaces/KyleS88/FileScout)** 

Note: You will most likely have to restart the space, this will take a couple of minutes so don't be alarmed.

***WARNING: DO NOT UPLOAD ANY SENSITIVE IMAGES AS THIS IS A PUBLIC SPACE USING A SHARED REDIS STORAGE*** 

## Architecture & Stack

* **Backend:** FastAPI, Python
* **Database:** Redis Stack (Vector Similarity Search)
* **AI/ML:** Hugging Face Transformers (CLIP model for embeddings)
* **Frontend:** React, TypeScript, Vite
* **Infrastructure:** Docker, Docker Compose

## Features

- [x] Upload and store images with automatic vector embedding generation
- [x] Perform semantic vector searches to find images based on contextual meaning rather than exact file names
- [x] Fallback to standard filename search when required
- [x] Fully containerized environment using Docker and Redis Stack for effortless local deployment

## Installation

To run FileScout locally, you will need to have Docker Desktop installed on your machine and opened. All database dependencies (like Redis Stack) are fully containerized and require no manual setup on your host machine. If you do not have Docker Desktop set up please follow the following links:

Windows: [https://docs.docker.com/desktop/setup/install/windows-install/](https://docs.docker.com/desktop/setup/install/windows-install/)

MacOS: [https://docs.docker.com/desktop/setup/install/mac-install/](https://docs.docker.com/desktop/setup/install/mac-install/)

Linux: [https://docs.docker.com/desktop/setup/install/linux/](https://docs.docker.com/desktop/setup/install/linux/)

1. Clone the repository to your local machine:
```
sh
git clone https://github.com/KyleS88/FileScout.git
cd FileScout
```
2. Start up the application and database:
```
docker-compose up --build
```
This command builds the FastAPI application and pulls the Redis Stack database automatically.

## Usage
Once the installation is complete and the Docker containers are running, you can access the full suite of FileScout tools locally:

1. Accessing the Web Application
Navigate to [http://localhost:7860](http://localhost:7860/) in your web browser to view the FileScout user interface. From here, you can upload images and perform semantic searches.

2. Accessing the Database (RedisInsight)
Redis Stack comes pre-packaged with RedisInsight, a visual UI for your database. You can monitor your vector database and inspect stored embeddings by navigating to [http://localhost:8001.](http://localhost:8001/).

## License
The FileScout project is open-sourced software licensed under the [MIT License](https://opensource.org/licenses/MIT).
