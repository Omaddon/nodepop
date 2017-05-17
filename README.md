# Nodepop v1.0.0

API para aplicaciones de venta de artículos de segunda mano. Válida para iOS y Android. Se usará una base de datos **Mongo** en la que se cargarán los anuncios y los usarios registrados. El registro de usuarios se llevará a cabo con **json web token**. Cada anuncio monstrará los siguientes datos:

* Nombre del artículo, un anuncio siempre tendrá un solo artículo.
* Si el artículo se vende o se busca.
* Precio. Será el precio del artículo en caso de ser una oferta de venta. En caso de que sea un anuncio de ‘se busca’ será el precio que el solicitante estaría dispuesto a pagar.
* Foto del artículo. Cada anuncio tendrá solo una foto.
* Tags del anuncio. Podrá contener uno o varios de estos cuatro: work, lifestyle, motor y mobile.

La API quedará arrancada en localhost:3000 y la base de datos de mongo en el puerto por defecto (27017).

## Dependencias

Las dependencias de NodeModules están registradas en el package.json de la API, por lo que para poder iniciar correctamente antes debe hacerse una instalacción de éstas con: `npm install` desde la carpeta de *nodepop*.

1. [Express](https://github.com/expressjs/express) ---> framework.
2. [isEmail](https://github.com/hapijs/isemail) ---> verificación de email.
3. [jsonwebtoken](https://github.com/Keats/jsonwebtoken) ---> generación de jwt.
4. [moment](https://github.com/moment/moment/) ---> manejo de tiempo para la gestión de los 'token'.
5. [mongoose](https://github.com/Automattic/mongoose) ---> ODM (Object Document Mapper).
6. [morgan](https://github.com/expressjs/morgan) ---> HTTP request logger middleware.

## Inicialización

Se proveen 4 métodos para inicializar la API. Se aconseja usar el *modo instalación db y desarollo*. Todos los métodos devuelven diversa información de utilidad por consola (como el 'token' del usuario generado de prueba).

* ***Modo estándar***: hace una carga simple de la API. No resetea la base de datos ni añade usuarios de test o anuncios.

```sh
$ npm start
```
* ***Modo desarollo***: modo desarrollo de la API. No resetea la base de datos ni añade usuarios de test o anuncios.

```
$ npm run dev
```
* ***Modo instalación db***: no arranca la API. Elimina todos los registros de usuarios y anuncios de la base de datos y hace una nueva carga con un usuario de prueba y los anuncios de anuncios.json de la librería. Muestra por consola el 'token' del usuario creado de prueba.

```
$ npm run installDB
```
* ***Modo instalación db y desarollo***: hace un reseteo de la base de datos (tanto usuarios como anuncios) y carga nuevos anuncios (igual que el 'modo instalación db') y muestra por consola el 'token' del nuevo usuario creado de prueba. Además, tras inicializar la base de datos, arranca la API en modo desarrollo.

```
$ npm run devReset
```

 Tanto el modo ***instalación db*** como el modo ***instalación db y desarollo*** admiten dos variables de entorno para definir la expiración de los token generados por la API (incluído el usuario de prueba).
 
 * **TIME**: define la duración del token. Debe ser mayor que 0. Si no se especifíca o no es mayor que 0, por defecto será 5.
 * **TYPE**: es el tipo de unidad de tiempo. Por ejemplo, 'm' dará una duración en minutos del tiempo específicado en TIME. Type debe ser del tipo: 'y', 'M', 'w', 'd', 'h', 'm', 's', 'ms' o 'Q' (año, mes, semana, dia, hora, minuto, segundo, milisegundo, quarter respectivamente). Si no se especifíca o no es un tipo válido, por defecto será 'm' (minutos).
 
 *Ejemplo*:
 
 ```sh
 $ TIME=1 TYPE='w' npm run devReset
 ```
En el ejemplo, la duración de los 'token' generados por la API, incluído el usuario de ejemplo, tendrán una validez de 1 semana. Además, hará una limpieza de la db, cargará los anuncios del anuncios.json y creará el usuario de pruebas (cuyo 'token' se visualizará por consola).

## API

A continuación se detalla el funcionamiento de ***nodepop***, así como su estructura interna y la forma de actualizar o modificar los datos creados al arrancar.

>### *Estructura de carpetas*

* ***/lib***: 
	* ***anuncions.json***: aquí podemos encontrar los anuncios que se cargarán al arrancar la API. Puede modificar este .json o añadir nuevos anuncios (respetando el esquema de datos).
	* ***errors.json***: registro de todos los errores que captura la API. Se añade al error la internacionalización de los errores (es: español, en: inglés). Así como mensajes personalizados de error y su código.
	* ***tags.js***: archivo javascript que devuelve el array con todos los tags disponibles de los anuncios. Si se quieren añadir nuevos tags disponibles para los anuncios, modificar este archivo.
	* ***config.js***: archivo javascript dónde se almacenará la clave privada para firmar los 'token' generados con jwt. Este archivo no se proporciona por motivos de seguridad y debe ser generado manualmente. Ejemplo: `module.exports = { Token_Secret: 'secretpass'};`

* ***/bin***:
	* ***/www***: aquí arrancamos la API y definimos la dirección y el puerto de escucha. Si se quiere cambiar, modificar este archivo.

* ***/public***:
	* ***/images***: aquí podemos localicar todas las imágenes de todos los anuncios de la API.

>### *Estructura de rutas*

* ***GET /apiv1/anuncios***: aquí podremos ver todos los anuncios de nuestra base de datos, siempre y cuando estemos registrados con un usuario válido. Bajo esta dirección se admiten filtros query:
	* *tag*: para filtrar por algún tag de los existentes.
	* *venta*: true o false. Filtra la búsqueda por anuncios en venta o en búsqueda.
	* *nombre*: busca un anucio en concreto.
	* *precio*: filtra los anuncios devueltos por precio. -50 mostrará precios máximo de 50. 50- mostrará precios de 50 o más. 50-100 mostrará precios en ese rango (ambos incluídos).
	* *sort*: ordena los anuncios devueltos por el campo elegido de menor a mayor. Con '-' delante del campo lo hará en orden inverso.
	* *limit*: limita los anuncios devueltos a dicho número.
	* *start*: paginación. Se salta los n resultados iniciales.
* ***GET /apiv1/anuncios/tags***: devuelve los tags disponibles en la API.
* ***POST /apiv1/anuncios***: si el usuario está registrado, le permite crear nuevos anuncios. *(no necesario, pero incluído a modo de práctica)*

* ***GET /images/anuncios/ 'nombredelrecurso.extensión'***: nos devuelve la imagen del anuncio. Se debe buscar una imagen en concreto, no el anuncio, incluyendo la extensión.

* ***POST /auth/signup***: nos permite registrar un nuevo usuario mediante jwt del usuario que nos den en el body de la petición, con la estructura siguiente:
	* *nombre*: no debe ser vacío, sin espacios en blanco. Se admiten nombres duplicados en db.
	* *email*: debe ser un correo válido. No admite duplicados en la db.
	* *clave*: debe tener una longitud mayor o igual a 4. Admite duplicados en la db.

Una vez registrado, la API nos devuelve un 'token' firmado, con la duración especificada en el arranque (por defecto 5 minutos). Dicho 'token' debe estar siempre presente en el header bajo la key 'token', en la ruta como un query bajo la key 'token' o en el body bajo la key 'token. Se compondrá del nombre del usuario, seguido de un espacio y el 'token' proporcionado por la API. En caso de no proporcionar el 'token', o si la validez de éste ha expirado, no se podrá acceder a ninguna ruta de la API, salvo a /auth. Un ejemplo podría ser:

`?token=userTest eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0OTQ5NjEzMDksImV4cCI6MTQ5NDk2MTYwOX0.vyI1cDfpaTMIrsxN5jVzGjI6H_CzKgWOZi-9vzcm4j4`

* ***POST /auth/login***: nos permite hacer login con un usuario válido (con la estructura arriba mencionada). Dicho usuario irá en el body de la petición. Se comproborá que el email sea correcto y la clave sea correcta. Si todo es correcto, se generará un nuevo 'token' (que será devuelto en formato json).
* ***GET /*** : ruta de presentación de la API. No tiene funcionalidad y se puede acceder sin permisos.

>### *Internacionalización*

Los mensajes de error que se proporcionan al usuario están disponibles en varios idiomas. En toda petición se comproborá que en la cabecera haya una key *language* con un valor 'es' o 'en' (español, inglés respectivamente). Si no aparece la key, el idioma por defecto es el español. No se admiten idiomas diferentes.

>### *Modelo de respuesta*

Las respuesta generadas por la API serán un json del tipo:

`{success: true/false, result: 'resultado de la llamada'}`

Por ejemplo:

```js
{
  "success": true,
  "result": [
    {
      "nombre": "Tardis",
      "venta": false,
      "precio": 5000,
      "foto": "tardis.jpg",
      "tags": [
        "work",
        "mobile"
      ]
    }
}
```


>### *Modelo de error*

Los errores devueltos por la API serán un json del tipo:

`{success: false, codeError: 'código de error', error: 'descripción del error'}`

Por ejemplo:

```js
{
  "success": false,
  "codeError": "404",
  "error": "Error. La página a la que intenta acceder no existe."
}
```
