# Use the official .NET SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

COPY backend.csproj ./
RUN dotnet restore

COPY . .

RUN dotnet publish backend.csproj -c Debug -o /app

RUN apt-get update \
    && apt-get install -y unzip curl \
    && curl -sSL https://aka.ms/getvsdbgsh | bash /dev/stdin -v latest -l /vsdbg

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app

COPY --from=build /app .
COPY --from=build /vsdbg /vsdbg

EXPOSE 80
EXPOSE 9229

CMD ["dotnet", "backend.dll"]