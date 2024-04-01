import os
import subprocess

def check_exists(resource_name):
    result = subprocess.run(f'docker inspect --format="{{{{.Id}}}}" {resource_name}')
    return result.returncode == 0

def remove_resource(resource_name, isImage):
    if(isImage):
        os.system(f'docker rmi -f {resource_name}')
    else:
        os.system(f'docker rm -f {resource_name}')

def create_image(image_name):
    os.system(f'docker build -t {image_name} .')

def create_container(container_name, image_name, host_port, container_port):
    os.system(f'docker run -d --name {container_name} -p {host_port}:{container_port} --network my_network {image_name}')

def new_image_container(image_name, container_name, host_port, container_port): 
    if(check_exists(container_name)):
        remove_resource(container_name, False)

    if(check_exists(image_name)):
        remove_resource(image_name, True)

    create_image(image_name)
    create_container(container_name, image_name, host_port, container_port)

BASE_DIR = os.getcwd()
os.system(f'docker network create my_network')

image_name = 'image_project'
container_name = 'container_project'
host_port = 9090
container_port = 9090

new_image_container(image_name, container_name, host_port, container_port)

dir_bc = os.path.join(BASE_DIR, 'backend', 'balanceadorDeCarga')
os.chdir(dir_bc)

image_name = 'image_bc'
container_name = 'container_bc'
host_port = 9093
container_port = 9093

new_image_container(image_name, container_name, host_port, container_port)

dir_s1 = os.path.join(BASE_DIR, 'backend', 'services', 'serviceA1')
os.chdir(dir_s1)

image_name = 'image_servicea1'
container_name = 'container_servicea1'
host_port = 9091
container_port = 9091

new_image_container(image_name, container_name, host_port, container_port)

dir_s2 = os.path.join(BASE_DIR, 'backend', 'services', 'servicea2')
os.chdir(dir_s2)

image_name = 'image_servicea2'
container_name = 'container_servicea2'
host_port = 9092
container_port = 9092

new_image_container(image_name, container_name, host_port, container_port)