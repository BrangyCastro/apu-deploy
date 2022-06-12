import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Historial } from './historial.entity';
import { HistorialRepository } from './historial.repository';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(HistorialRepository)
    private historialRepository: HistorialRepository,
  ) {}

  async registrarAcceso(
    id: number,
    nombre: string,
    tipo: string,
    responsable?: string,
    responsableId?: number,
  ) {
    const acceso = new Historial();
    acceso.idUser = id;
    acceso.nombreUser = nombre;
    acceso.fecha = new Date();
    acceso.type = tipo;
    acceso.responsableId = responsableId || null;
    acceso.responsableNombre = responsable || null;

    try {
      acceso.save();
    } catch (error) {
      console.log(error);
    }
  }

  async ultimoAcceso(id: number) {
    const ultimo = await this.historialRepository
      .createQueryBuilder('historial')
      .where('historial.idUser  = :id', { id })
      .orderBy('fecha', 'DESC')
      .limit(2)
      .getMany();
    // this.historialRepository.find({
    //   where: { idUser: id },
    //   order: { fecha: 'DESC' },
    //   take: 1,
    // });

    return ultimo;
  }
}
