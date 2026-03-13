import { LostPet } from 'src/core/entities/lost-pet.entity';
import { FoundPet } from 'src/core/entities/found-pet.entity';
import { generateMapboxStaticImage } from '../utils/mapbox.utils';

interface TemplateParams {
  lostPet: LostPet;
  foundPet: FoundPet;
  lostLat: number;
  lostLon: number;
  foundLat: number;
  foundLon: number;
}

export const generateFoundPetEmailTemplate = (params: TemplateParams): string => {
  const { lostPet, foundPet, lostLat, lostLon, foundLat, foundLon } = params;
  const mapImageUrl = generateMapboxStaticImage(lostLat, lostLon, foundLat, foundLon);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #e74c3c;">🐾 PetRadar - Posible avistamiento de tu mascota</h1>

      <p>Hola <strong>${lostPet.owner_name}</strong>,</p>
      <p>Alguien encontró una mascota cerca del lugar donde perdiste a <strong>${lostPet.name}</strong>. ¡Podría ser ella!</p>

      <hr style="border: 1px solid #eee; margin: 20px 0;" />

      <h2 style="color: #2c3e50;">Mascota encontrada</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 6px; font-weight: bold;">Especie:</td><td>${foundPet.species}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Raza:</td><td>${foundPet.breed ?? 'No identificada'}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Color:</td><td>${foundPet.color}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Tamaño:</td><td>${foundPet.size}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Descripción:</td><td>${foundPet.description}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Dirección:</td><td>${foundPet.address}</td></tr>
      </table>

      ${foundPet.photo_url ? `<img src="${foundPet.photo_url}" alt="Foto mascota encontrada" style="width:100%;max-width:400px;margin:10px 0;border-radius:8px;" />` : ''}

      <hr style="border: 1px solid #eee; margin: 20px 0;" />

      <h2 style="color: #2c3e50;">Contacto de quien la encontró</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 6px; font-weight: bold;">Nombre:</td><td>${foundPet.finder_name}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Correo:</td><td><a href="mailto:${foundPet.finder_email}">${foundPet.finder_email}</a></td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Teléfono:</td><td>${foundPet.finder_phone}</td></tr>
      </table>

      <hr style="border: 1px solid #eee; margin: 20px 0;" />

      <h2 style="color: #2c3e50;">Mapa: Dónde se perdió vs Dónde fue encontrada</h2>
      <p>
        <span style="color: red;">● Rojo</span>: Lugar donde se perdió ${lostPet.name}<br/>
        <span style="color: blue;">● Azul</span>: Lugar donde fue encontrada la mascota
      </p>
      <img
        src="${mapImageUrl}"
        alt="Mapa de ubicaciones"
        style="width: 100%; max-width: 600px; border-radius: 8px; margin-top: 10px;"
      />

      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #7f8c8d; font-size: 12px;">Este correo fue generado automáticamente por PetRadar.</p>
    </div>
  `;
};
