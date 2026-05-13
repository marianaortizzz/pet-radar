FROM node:alpine
#alpine-> version reducida de node
#Crear carpeta
WORKDIR /app
#Las imagenes de docker funcionan por capas, cada comando es una capa
#Copiar el proyecto a imagen de Docker, copiar y pegar todo
COPY package.json package-lock.json* ./
#Instalar dependencias
RUN npm install
#Compilar el proyecto, compila el proyecto de node como si fuera nest
COPY . .
RUN npm run build
EXPOSE 3002
#Colocar un comando de inicio
CMD ["node", "dist/main"]
