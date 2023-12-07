#!/bin/bash
AZURE_RESOURCE_GROUP_ACA=rg_demo_beauty_aca
AZURE_RESOURCE_GROUP_ACR=rg_demo_container
AZURE_LOCATION=westeurope
ACR_NAME=peteracr007
ENVIRONMENT_NAME=environmentaca
APPLICATION="hello-aca"
VERSION_1_APPLICATION=1.0.0
REVISION_01=rev-01
VERSION_2_APPLICATION=2.0.0
REVISION_02=rev-02

az group create \
   --name $AZURE_RESOURCE_GROUP_ACA \
   --location $AZURE_LOCATION

az acr show \
   --name $ACR_NAME \
   --resource-group $AZURE_RESOURCE_GROUP_ACR \
   --output table

az containerapp env create \
   --name $ENVIRONMENT_NAME \
   --resource-group $AZURE_RESOURCE_GROUP_ACA \
   --location $AZURE_LOCATION \
   --logs-destination none

az acr build -t $ACR_NAME.azurecr.io/$APPLICATION:$VERSION_1_APPLICATION -r $ACR_NAME .
#az acr build -t $ACR_NAME.azurecr.io/$APPLICATION:$VERSION_2_APPLICATION -r $ACR_NAME .

REGISTRY_PASSWORD=$(az acr credential show --name $ACR_NAME -o tsv --query "passwords[0].value")

az containerapp create \
  --name $APPLICATION \
  --resource-group $AZURE_RESOURCE_GROUP_ACA \
  --environment $ENVIRONMENT_NAME \
  --image $ACR_NAME.azurecr.io/$APPLICATION:$VERSION_1_APPLICATION \
  --revision-suffix $REVISION_01 \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $ACR_NAME \
  --registry-password $REGISTRY_PASSWORD \
  --target-port 3000 \
  --ingress 'external' \
  --query properties.configuration.ingress.fqdn \
  -o jsonc