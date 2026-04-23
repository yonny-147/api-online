# Despliegue en AWS EC2 Free Tier

## Paso 1: Crear instancia EC2

1. **AWS Console > EC2 > Launch Instance**
2. Configurar:
   - **Name**: `api-mock-epayco`
   - **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance type**: `t2.micro` (Free tier eligible)
   - **Key pair**: Create new > `api-mock-key` > RSA > `.pem` > Descargar
   - **Network**: Auto-assign public IP: Enable
3. Launch y copiar la IP publica

## Paso 2: Abrir puerto 3000 en Security Group

1. Click en el Security Group de la instancia
2. Inbound rules > Edit > Add rule:
   - Type: Custom TCP | Port: 3000 | Source: 0.0.0.0/0
3. Save rules

## Paso 3: Subir archivos

```powershell
cd "C:\Users\yonny.ospina.EPAYCO\Documents\programacion\API ONLINE"
.\deploy\upload-aws.ps1 -IP "TU_IP" -Key "C:\ruta\api-mock-key.pem"
```

## Paso 4: Setup en el servidor

```powershell
ssh -i "C:\ruta\api-mock-key.pem" ubuntu@TU_IP
```

```bash
cd ~/api-mock
chmod +x deploy/setup-aws.sh
./deploy/setup-aws.sh
```

## Paso 5: Verificar

```
curl http://TU_IP:3000/
```

## Configuracion en el proveedor

### Sin seguridad
- URL confirmacion: `http://TU_IP:3000/no-auth/confirmacion`
- Seguridad: OFF

### Basic Auth
- URL confirmacion: `http://TU_IP:3000/basic/confirmacion`
- Seguridad: ON
- Tipo autenticacion: Basic
- Usuario: testuser
- Contrasena: testpass
- URL login: `http://TU_IP:3000/basic/login`

### JWT
- URL confirmacion: `http://TU_IP:3000/jwt/confirmacion`
- Seguridad: ON
- Tipo autenticacion: JWT
- URL login: `http://TU_IP:3000/jwt/login`
- Variable token: token
- Tipo peticion: GET

## Comandos utiles (SSH)

```bash
pm2 status
pm2 logs api-mock
pm2 restart api-mock
```
