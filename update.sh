#!/bin/bash

fecha=$(date)
git pull
if [ $? -ne 0 ]
then
	echo $fecha >> update.log
	echo "!! Error al descargar los cambios." >> update.log
	exit 1
fi

npm install
if [ $? -ne 0 ]
then
	echo $fecha >> update.log
	echo "!! Error al instalar las dependencias." >> update.log
	exit 2
fi

pm2 restart Nodepop
if [ $? -ne 0 ]
then
	echo $fecha >> update.log
	echo "!! Error al arrancar Nodepop." >> update.log
	exit 3
fi

echo $fecha >> update.log
echo ">> Todo correcto. Nodepop actualizada correctamente." >> update.log
exit 0
