start_university_node:
	cd universityNode && docker-compose up -d

start_boulez_node:
	cd boulezNode && docker-compose up -d

stop_university_node:
	cd universityNode && docker-compose stop

stop_boulez_node:
	cd boulezNode && docker-compose stop

start:
	make start_university_node && make start_boulez_node

stop:
	make stop_university_node && make stop_boulez_node