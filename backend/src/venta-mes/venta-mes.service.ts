import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { VentaMesRepository } from './venta-mes.repository';
import { UserRepository } from '../user/user.repository';
import { ProveedorRepository } from '../proveedor/proveedor.repository';
import { User } from '../user/user.entity';
import { Proveedor } from '../proveedor/proveedor.entity';
import { VentaMes } from './venta-mes.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { GetVentasFilterDto } from './dto/get-ventas-filter.dto';
import { ApuExtensionRepository } from '../apuextension/apuextension.repository';
import { ApuExtension } from '../apuextension/apuextension.entity';
import { GetVentasCustomDto } from './dto/get-ventas-custom.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { TthhRepository } from '../tthh/tthh.repository';
import { Tthh } from '../tthh/tthh.entity';
import { HistorialService } from 'src/historial/historial.service';

@Injectable()
export class VentaMesService {
  constructor(
    @InjectRepository(VentaMesRepository)
    private ventaMesRepository: VentaMesRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(ProveedorRepository)
    private proveedorRepository: ProveedorRepository,
    @InjectRepository(ApuExtensionRepository)
    private apuExtensionRepository: ApuExtensionRepository,
    @InjectRepository(TthhRepository)
    private tthhRepository: TthhRepository,
    private historialService: HistorialService,
  ) {}

  async getVentaMesAnioProveedorAlls(
    filterDto: GetVentasFilterDto,
  ): Promise<VentaMes[] | { VentaMes: VentaMes[]; total } | VentaMes> {
    return this.ventaMesRepository.getVentaMesAnioProveedorAlls(filterDto);
  }

  async getVentaCustomAlls(filterDto: GetVentasCustomDto): Promise<VentaMes[]> {
    return this.ventaMesRepository.getVentaCustomAlls(filterDto);
  }

  async getVentaMesUserAlls(mes: Date, userId: string): Promise<VentaMes[]> {
    return this.ventaMesRepository.getVentaMesUserAlls(mes, userId);
  }

  async getVentaMesAnioAlls(mes: Date): Promise<VentaMes[]> {
    return this.ventaMesRepository.getVentaMesAnioAllsCuston(mes);
  }

  async createVentaCSV(
    allVentas,
    idProveedor: number,
    mes: Date,
  ): Promise<number> {
    let contador = 0;
    await Promise.all(
      allVentas.map(async data => {
        const found: User = await this.userRepository.findOne({
          where: {
            cedula: data.CEDULA,
          },
        });

        if (found) {
          const prov: Proveedor = await this.proveedorRepository.findOne({
            where: {
              id: idProveedor,
            },
          });

          const venta = new VentaMes();
          venta.codigo = data.CODIGO || '';
          venta.user = found;
          venta.proveedor = prov;
          venta.producto = data.PRODUCTO || '';
          venta.factura = data.FACTURA_NO || '';
          venta.fechaEmision = data.FECHA_EMISION || null;
          venta.mesPago = data.MES;
          venta.mesDescontar = mes;
          venta.totalVenta = this.cantidadDouble(data.PVP) || 0;
          venta.totalMeses = data.TOTAL_MESES || 0;
          venta.cuotaMeses = data.CUOTA_MESES || 0;
          venta.valorCuota = this.cantidadDouble(data.VALOR_CUOTA);
          venta.valorPendiente = this.cantidadDouble(data.VALOR_PENDIENTE) || 0;

          try {
            contador++;
            await venta.save();
          } catch (error) {
            console.log(error);
            console.log(error);
            throw new InternalServerErrorException(
              'Error al Guardar el producto',
            );
          }
        }
        // }
      }),
    );
    return contador;
  }

  async createVentaApuCSV(
    allVentas,
    idApu: number,
    mes: Date,
  ): Promise<number> {
    let contador = 0;
    await Promise.all(
      allVentas.map(async data => {
        const found: User = await this.userRepository.findOne({
          where: {
            cedula: data.CEDULA,
          },
        });

        if (found) {
          const prov: ApuExtension = await this.apuExtensionRepository.findOne({
            where: {
              id: idApu,
            },
          });

          const venta = new VentaMes();
          venta.codigo = data.CODIGO || '';
          venta.user = found;
          venta.apuExtension = prov;
          venta.producto = data.PRODUCTO || '';
          venta.factura = data.FACTURA_NO || '';
          venta.fechaEmision = data.FECHA_EMISION || null;
          venta.mesPago = data.MES;
          venta.mesDescontar = mes;
          venta.totalVenta = this.cantidadDouble(data.PVP) || 0;
          venta.totalMeses = data.TOTAL_MESES || 0;
          venta.cuotaMeses = data.CUOTA_MESES || 0;
          venta.valorCuota = this.cantidadDouble(data.VALOR_CUOTA);
          venta.valorPendiente = this.cantidadDouble(data.VALOR_PENDIENTE) || 0;

          try {
            contador++;
            await venta.save();
          } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(
              'Error al Guardar el producto',
            );
          }
        }
        // }
      }),
    );
    return contador;
  }

  async createVentaReview(allVentas): Promise<any[]> {
    const results = [];
    await Promise.all(
      allVentas.map(async (data, i) => {
        // console.log(typeof data.PVP);
        // console.log(parseFloat(data.PVP));
        // console.log(typeof data.PVP);
        let dataTemp = { ...data, id: i, user: true };
        const query = await this.userRepository.createQueryBuilder('user');
        query.where('user.cedula = :ci', { ci: dataTemp.CEDULA });
        const user = await query.getOne();
        if (!user) {
          dataTemp = { ...dataTemp, user: false };
          await results.push(dataTemp);
        }
        if (dataTemp.MES === null) {
          await results.push(dataTemp);
        }
        if (dataTemp.PVP === null) {
          await results.push(dataTemp);
        }
        if (dataTemp.VALOR_PENDIENTE === null) {
          await results.push(dataTemp);
        }
        if (dataTemp.VALOR_CUOTA === null) {
          await results.push(dataTemp);
        }
        if (dataTemp.TOTAL_MESES === null) {
          await results.push(dataTemp);
        }
        if (dataTemp.CUOTA_MESES === null) {
          await results.push(dataTemp);
        }
      }),
    );
    return results;
  }

  async updateVenta(
    id: number,
    updateVentaDto: UpdateVentaDto,
    userToken: User,
  ) {
    const {
      userId,
      proveedor,
      apuExtension,
      producto,
      mesPago,
      factura,
      fechaEmision,
      totalVenta,
      cuotaMeses,
      totalMeses,
      valorCuota,
      valorPendiente,
    } = updateVentaDto;

    try {
      const existUser = await this.userRepository.findOne({ id: userId });

      if (!existUser) {
        throw new ConflictException('El ususario no existe');
      }

      const venta = await this.ventaMesRepository.findOne({ id });

      if (!venta) {
        throw new ConflictException('No existe la nómina');
      }

      let existProveedor = null;
      let existApuExtension = null;

      if (proveedor !== null) {
        existProveedor = await this.proveedorRepository.findOne({
          id: proveedor,
        });

        if (!existProveedor) {
          throw new ConflictException('El proveedor no existe');
        }
      }

      if (apuExtension !== null) {
        existApuExtension = await this.apuExtensionRepository.findOne({
          id: apuExtension,
        });

        if (!existApuExtension) {
          throw new ConflictException('La extensión no existe');
        }
      }

      const ventaMes = new VentaMes();
      ventaMes.user = existUser;
      ventaMes.proveedor = existProveedor;
      ventaMes.apuExtension = existApuExtension;
      ventaMes.producto = producto;
      ventaMes.mesPago = mesPago;
      ventaMes.valorCuota = valorCuota;
      ventaMes.totalVenta = totalVenta;
      ventaMes.factura = factura;
      ventaMes.fechaEmision = fechaEmision;
      ventaMes.totalMeses = totalMeses;
      ventaMes.cuotaMeses = cuotaMeses;
      ventaMes.valorPendiente = valorPendiente;

      await this.ventaMesRepository.update(id, ventaMes);

      await this.historialService.registrarAcceso(
        existUser.id,
        `${existUser.nombres} (${id})`,
        'NOMINA ACTUALIZADA',
        userToken.nombres,
        userToken.id,
      );

      const { user, mesDescontar } = venta;
      const tthh = await this.tthhRepository.findOne({
        user,
        fechaPago: mesDescontar,
      });

      if (!tthh) {
        return;
      }

      const total = await this.totalProveedor(mesDescontar, user.id);

      const tthhUpdate = new Tthh();
      tthhUpdate.totalProveedor = total.total;
      const tthhTotal = parseFloat(tthh.aporte) + parseFloat(total.total);
      tthhUpdate.total = tthhTotal.toString();
      await this.tthhRepository.update(tthh.id, tthhUpdate);

      return tthhUpdate;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al actualizar.');
    }
  }

  //TODO: Revisar donde lo estoy utilizando
  async createVentaSingle(createVentaDto: CreateVentaDto) {
    const {
      fechaEmision,
      producto,
      mesPago,
      cuotaMeses,
      totalMeses,
      valorCuota,
      valorPendiente,
      totalVenta,
      factura,
      proveedor,
      userId,
      apuExtension,
      mesDescontar,
      codigo,
    } = createVentaDto;

    const existUser = await this.userRepository.findOne({ id: userId });

    if (!existUser) {
      throw new ConflictException('El ususario no existe');
    }

    let existProveedor = null;
    let existApuExtension = null;

    if (proveedor !== null) {
      existProveedor = await this.proveedorRepository.findOne({
        id: proveedor,
      });

      if (!existProveedor) {
        throw new ConflictException('El proveedor no existe');
      }
    }

    if (apuExtension !== null) {
      existApuExtension = await this.apuExtensionRepository.findOne({
        id: apuExtension,
      });

      if (!existApuExtension) {
        throw new ConflictException('La extensión no existe');
      }
    }

    const venta = new VentaMes();
    venta.fechaEmision = fechaEmision;
    venta.producto = producto;
    venta.mesPago = mesPago;
    venta.cuotaMeses = cuotaMeses;
    venta.valorCuota = valorCuota;
    venta.valorPendiente = valorPendiente;
    venta.totalVenta = totalVenta;
    venta.factura = factura;
    venta.totalMeses = totalMeses;
    venta.proveedor = existProveedor;
    venta.apuExtension = existApuExtension;
    venta.user = existUser;
    venta.mesDescontar = mesDescontar;
    venta.codigo = codigo;

    try {
      await venta.save();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al Guardar el producto');
    }
  }

  cantidadDouble(cantidad) {
    if (cantidad !== 0) {
      const cantidad1 = cantidad.replace('.', '');
      const cantidad2 = cantidad1.replace('.', '');
      const cantidad3 = cantidad2.replace(',', '.');
      return cantidad3;
    } else {
      return cantidad;
    }
  }

  async totalProveedor(fechaPago, userId) {
    const venta = await this.ventaMesRepository
      .createQueryBuilder()
      .select('userId', 'Docente')
      .addSelect('mesDescontar', 'Mes')
      // .addSelect('id', 'idVenta')
      .addSelect('SUM(valorCuota)', 'total')
      .where('mesDescontar = :mes', { mes: fechaPago })
      .andWhere('userId = :userId', { userId })
      .addGroupBy('userId')
      .getRawOne();

    return venta;
  }
}
