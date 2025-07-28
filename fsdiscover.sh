#!/bin/bash
APP_DIR="$HOME/.local/share/fsdiscover"
V=$(cat "$APP_DIR/version")

cd "$APP_DIR" || {
  echo "Failure: Unable to change to application directory $APP_DIR"
  exit 1
}

PARAM1=${1:-nil}
PARAM2=${2:-nil}

if [ $PARAM1 == "--logs" ] || [ $PARAM1 == "-l" ]; then
    echo "Opening logs directory... Please wait"
    cd logs
    open . || {
        echo "Unable to open logs directory... Falling back to terminal view"
        pwd && ls -l
    }
    exit $?
elif [ $PARAM1 == "--uninstall" ] || [ $PARAM1 == "-u" ]; then
    ./uninstall.sh
    exit $?
elif [ $PARAM1 == "--version" ] || [ $PARAM1 == "-v" ]; then
    echo $V
    exit 0
elif [ $PARAM1 == "--help" ] || [ $PARAM1 == "-h" ]; then
    echo "Usage: fsdiscover [option...]"
    echo ""
    echo "-l, --logs            See Fsdiscover logs"
    echo "-p, --prefer          Supply a prefered network interface. e.g fsdiscover --prefer <interface_name>"
    echo "                      This will be ignored if the interface is not available"
    echo "-u, --uninstall       Uninstall (remove) fsdiscover"
    echo "-v, --version         See current version"
    echo "-h, --help            See Help"
    echo ""
    echo "For more information, contact sprintetmail@gmail.com"
    exit 0
fi


echo "-----------------------------------------"
echo ""
echo "        Sprint FS Discover $V"
echo ""
echo "-----------------------------------------"

PARAMS=""

if [ $PARAM1 == "--prefer" ] || [ $PARAM1 == "-p" ] && [ $PARAM2 ]; then
    echo "Initiator: Prefered network interface set to: $PARAM2"
    echo "Initiator: Prefered network interface will be ignored if not available"
    PARAMS="--prefer $PARAM2"
fi

if [ -d ../update/fsdiscover-main ]; then
  echo "Initiator: Implementing Updates..."
  if [ -f ../update/fsdiscover-main/package.json ]; then
    cd ../update/fsdiscover-main
    chmod +x ./install.sh
    ./install.sh --auto; cd ../../ ; rm -r update/fsdiscover-main; rm sysnet.zip; 
    exec fsdiscover
  else
    echo "Initiator: Updates not Implemented... failed to locate package.json in update directory... fsdiscover shall proceed"
    rm -r update
  fi
fi

# Check for node_modules and start the application
if [ -d node_modules ]; then
  node index.js $PARAMS 
else
  echo "Failure: node_modules not found... Run './install.sh' or 'npm install' on CLI to install dependencies"
fi

if [ -d node_modules ]; then
  node index.js $PARAMS 
fi