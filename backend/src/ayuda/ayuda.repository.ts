import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Ayuda } from './ayuda.entity';
import { CreateAyudaDto } from './dto/create-ayuda.dto';

@EntityRepository(Ayuda)
export class AyudaRepository extends Repository<Ayuda> {
  async createAyuda(createAyudaDto: CreateAyudaDto): Promise<Ayuda> {
    const {
      banco,
      tipoCuenta,
      nCuenta,
      concepto,
      fechaEmision,
      porcentaje,
      totalMeses,
      user,
      valorDepositar,
      valorSolicitado,
      valorCuota,
      total,
    } = createAyudaDto;

    const newAyuda = new Ayuda();
    newAyuda.banco = banco;
    newAyuda.tipoCuenta = tipoCuenta;
    newAyuda.nCuenta = nCuenta;
    newAyuda.concepto = concepto;
    newAyuda.fechaEmision = fechaEmision;
    newAyuda.porcentaje = porcentaje;
    newAyuda.totalMeses = totalMeses;
    newAyuda.user = user;
    newAyuda.valorDepositar = valorDepositar;
    newAyuda.valorSolicitado = valorSolicitado;
    newAyuda.valorCuota = valorCuota;
    newAyuda.total = total;

    try {
      const ayuda = await this.save(newAyuda);
      return ayuda;
    } catch (error) {
      throw new InternalServerErrorException('Error al Guardar la Ayuda.');
    }
  }
  async getAyudaAlls(): Promise<Ayuda[]> {
    try {
      const ayuda: Ayuda[] = await this.createQueryBuilder('ayuda')
        // .innerJoinAndSelect('convenio.proveedorId', 'convenio')
        //   .where('apuextension.status = "ACTIVE"')
        .getMany();

      return ayuda;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
