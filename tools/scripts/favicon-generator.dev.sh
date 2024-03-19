secrets_file="./configs/envs/.env.secrets"
favicon_folder="./public/favicon/"
FAVICON_GENERATOR_TEMPLATE_FILE_NAME="./configs/favicon-generator.template.json"
FAVICON_GENERATOR_TEMPLATE=$(cat "$FAVICON_GENERATOR_TEMPLATE_FILE_NAME")
if [ ! -f "$secrets_file" ]; then
    echo "Error: File '$secrets_file' not found."
    exit 1
fi

dotenv \
  -v FAVICON_GENERATOR_TEMPLATE=$FAVICON_GENERATOR_TEMPLATE \
  -e $secrets_file \
  -- bash -c 'cd ./deploy/tools/favicon-generator && ./script.sh'

if [ -d "$favicon_folder" ]; then
  rm -r "$favicon_folder"
fi
mkdir -p "$favicon_folder"
cp -r ./deploy/tools/favicon-generator/output/* "$favicon_folder"