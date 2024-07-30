# Mister Tie
Symfony and React project to display 3D map

# Version
Php 8.2
Symfony 7.1
React 18.3.1

# Dependancies
[mapbox-gl](https://docs.mapbox.com/mapbox-gl-js/api/map/)

# Cmd 
- npm run dev
- npm run build
- npm run watch
- php bin/console app:add-user user@example.com password123 ROLE_USER

# Updates
- Add editor
- Add Search box (based on title or description)
- Add Doctrine extention beberlei for trigonometric function
- Update marker repository to get marker nearest from camera position

# JWT 
GENERATE KEYS : php bin/console lexik:jwt:generate-keypair

# migration
php bin/console doctrine:migrations:migrate
php bin/console doctrine:migrations:status

