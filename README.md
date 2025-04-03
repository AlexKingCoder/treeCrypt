# TreeCrypt - Sistema de Encriptación Avanzado

TreeCrypt es una aplicación web de encriptación avanzada que utiliza múltiples capas de seguridad para proteger tus archivos.

## Características

- **Encriptación Avanzada**: Utiliza un sistema de múltiples capas que combina núcleos procedurales y otras 5 capas de seguridad adicionales.
- **Seguridad Robusta**: Implementa verificaciones de integridad en cada paso del proceso.
- **Llave de Seguridad**: Proporciona un archivo llave para poder desencriptar el archivo.
- **Interfaz Intuitiva**: Diseño moderno y fácil de usar con soporte para arrastrar y soltar archivos.

## Capas de Seguridad

### 1. Generación de Núcleos Procedurales
- **Núcleos Procedurales**: Generación de 12 núcleos únicos basados en la contraseña
- **Orden Aleatorio**: Los núcleos se aplican en un orden aleatorio determinado por la contraseña
- **Caracteres Base**: Uso de un conjunto extenso de caracteres para la encriptación
- **Permutaciones**: Cada núcleo utiliza permutaciones únicas de los caracteres base
- **Complejidad**: El uso de 12 núcleos proporciona una complejidad exponencialmente mayor que sistemas con menos núcleos

### 2. Procesamiento de Bytes
- **Rotación de Bits**: Aplicación de 8 niveles diferentes de rotación de bits
- **Procesamiento en Bloques**: Los datos se procesan en bloques de tamaño configurable
- **Verificación de Integridad**: Cada etapa del procesamiento incluye verificación de integridad

### 3. Fragmentación y Ruido
- **Fragmentación Aleatoria**: Los datos se dividen en bloques de tamaño variable
- **Orden de Bloques Aleatorio**: Los bloques se reorganizan de manera aleatoria
- **Inserción de Ruido**: Se añaden datos aleatorios en posiciones estratégicas
- **Padding Dinámico**: Cada bloque recibe un padding de tamaño variable

### 4. Encriptación XOR
- **Clave XOR Dinámica**: Generación de una clave XOR única para cada sesión
- **Aplicación Cíclica**: La clave XOR se aplica de manera cíclica sobre los datos
- **Longitud Variable**: La longitud de la clave XOR es configurable

### 5. Verificación de Integridad
- **Hashes de Verificación**: Cálculo de hashes en cada etapa del proceso
- **Verificación de Bytes**: Comprobación de la integridad de los datos procesados
- **Detección de Manipulación**: Capacidad para detectar alteraciones en los datos

### 6. Protección contra Análisis
- **Entropía Controlada**: Mantenimiento de niveles de entropía consistentes
- **Ruido Aleatorio**: Inserción de datos aleatorios para dificultar el análisis
- **Fragmentación No Lineal**: División de datos que dificulta la reconstrucción

## Uso

1. **Encriptar un archivo**:
   - Selecciona un archivo arrastrándolo o usando el botón de selección
   - Establece una contraseña segura
   - Descarga el archivo encriptado y el archivo de llave

2. **Desencriptar un archivo**:
   - Selecciona el archivo encriptado
   - Selecciona el archivo llave correspondiente
   - Ingresa la contraseña
   - Descarga el archivo desencriptado

## Consideraciones de Seguridad

- **Contraseñas Fuertes**: Se recomienda usar contraseñas de al menos 12 caracteres
- **Almacenamiento Seguro**: Guarda los archivos de clave en un lugar seguro
- **Verificación de Integridad**: Siempre verifica la integridad de los archivos encriptados
- **Eliminación Segura**: Los archivos originales no se eliminan automáticamente

## Limitaciones

- El tamaño máximo de archivo es de 20mb
- La velocidad de encriptación depende del tamaño del archivo y la potencia del sistema
- Se requiere el archivo de clave original para la desencriptación
- Ten en cuenta que la aplicación pública puede descontinuarse en cualquier momento. No encriptes archivos críticos utilizando esta aplicación, ya que, si deja de estar disponible en el futuro, no podrás desencriptar tus archivos.

## Licencia

TreeCrypt Copyright 2024 - Alex Gil Spencer (King Coder) - Todos los derechos reservados.

Este software está protegido por una licencia personalizada que restringe su uso al entorno público donde se publica. No está permitida la reproducción, modificación o uso de esta aplicación fuera de su entorno público de publicación.

Para más detalles, consulta el archivo [LICENSE](LICENSE).