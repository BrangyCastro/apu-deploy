import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { LocalidadModule } from './localidad/localidad.module';
import { FacultadModule } from './facultad/facultad.module';
import { RolesModule } from './roles/roles.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { VentaMesModule } from './venta-mes/venta-mes.module';
import { TthhModule } from './tthh/tthh.module';
import { PromoModule } from './promo/promo.module';
import { ConvenioModule } from './convenio/convenio.module';
import { ApuextensionModule } from './apuextension/apuextension.module';
import { MailModule } from './mail/mail.module';
import { InformeModule } from './informe/informe.module';
import { PresupuestoModule } from './presupuesto/presupuesto.module';
import { TthhPagosModule } from './tthh-pagos/tthh-pagos.module';
import { HistorialModule } from './historial/historial.module';
import { AyudaModule } from './ayuda/ayuda.module';
import { AyudaCuotaModule } from './ayuda-cuota/ayuda-cuota.module';
import { PagosVariosModule } from './pagos_varios/pagos_varios.module';
import { TipoPagoModule } from './tipo-pago/tipo-pago.module';
import { SendMailModule } from './send-mail/send-mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ScheduleModule.forRoot(),
    UserModule,
    LocalidadModule,
    FacultadModule,
    RolesModule,
    ProveedorModule,
    MulterModule.register({
      dest: './upload',
    }),
    VentaMesModule,
    TthhModule,
    PromoModule,
    ConvenioModule,
    ApuextensionModule,
    MailModule,
    InformeModule,
    PresupuestoModule,
    TthhPagosModule,
    HistorialModule,

    AyudaModule,
    AyudaCuotaModule,
    PagosVariosModule,
    TipoPagoModule,
    SendMailModule,
  ],
})
export class AppModule {}
