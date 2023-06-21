import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const oracledb = require('oracledb');

export default class JsonVistasController {

  public async index(ctx: HttpContextContract) {
    const  {documento}  = ctx.params
    
    let connection
    try {
      oracledb.initOracleClient();

      connection = await oracledb.getConnection({
        user: "USU_CONSULTA",
        password: "USU_CONSULTA2023",  // contains the hr schema password
        connectString: "172.16.2.55:1521/VIGIAPRO.supertransporte.local",
        encoding: 'UTF-8'

      });


    } catch (error) {
      return ctx.response.status(500).send({
        mensaje: `Error de conexión a vista`,
        error: 4
      })
    }




    let consulta = "select * from VIGIA.VW_HOMOLOGADOS_SEDES where NUMERO_DOCUMENTO='" + documento + "'";


    let vista
    try {
      vista = await connection.execute(consulta,
        [], // no binds
        {
          outFormat: oracledb.OBJECT
        });

    } catch (error) {
      await connection.close();
      return ctx.response.status(500).send({
        mensaje: `Error de procesamiento de vista`,
        error: 3
      })
    }

    await connection.close();

    if (vista.rows.length <= 0) {
      return ctx.response.status(400).send({
        mensaje: `No se encontraron datos del vigilado`,
        error: 2
      })
    }

       

    let id1 ;
    let nombre_Documento1 = ''
    if(vista.rows[0].TIPO_DOC_REP_LEGAL == 'CEDULA'){
      id1 = 1;
      nombre_Documento1 = 'Cédula de Ciudadanía'
    }
    if(vista.rows[0].TIPO_DOC_REP_LEGAL == 'CARNET DIPLOMATICO'){
      id1 = 9;
      nombre_Documento1 = 'carnet diplomático'
    }
    if(vista.rows[0].TIPO_DOC_REP_LEGAL == 'PASAPORTE'){
      id1 = 3;
      nombre_Documento1 = 'Pasaporte'
    }
    if(vista.rows[0].TIPO_DOC_REP_LEGAL == 'CEDULA EXTRANJERIA'){
      id1 = 4;
      nombre_Documento1 = 'Cédula de Ciudadanía'
    }
    if(vista.rows[0].TIPO_DOC_REP_LEGAL == 'ANONIMO'){
      id1 = 10;
      nombre_Documento1 = 'Anónimo'
    }

    let num_Est_VIGIA = vista.rows.length;


    return {
      //VIGILADO
      nit: `${(vista.rows[0].NUMERO_DOCUMENTO) ?? ''}-${(vista.rows[0].DIGITO_VERIFICACION) ?? ''}`,
      razon_Social: (vista.rows[0].NOMBRE_VIGILADO) ?? '',
      codigo_Departamento: (vista.rows[0].ID_DEPARTAMENTO) ?? '',
      nombre_Departamento: (vista.rows[0].NOMBRE_DEPTO) ?? '',
      codigo_Ciudad: (vista.rows[0].ID_MUNICIPIO) ?? '',
      nombre_Ciudad: (vista.rows[0].NOMBRE_MUNICIPIO) ?? '',
      telefono: (vista.rows[0].TELEFONO) ?? '',
      mail_Establecimiento: (vista.rows[0].CORREO_ELECTRONICO) ?? '',
      dir_Establecimiento: (vista.rows[0].DIRECCION) ?? '',
      tipo_Sociedad:  '',
      tipo_Sociedad_Nombre:  '',

      //REPRESENTANTE
      id1,
      nombre_Documento1,
      nro_Documento: (vista.rows[0].NUMERO_DOCU_REPRESENTANTE) ?? '',
      nombres_Apellidos: `${(vista.rows[0].NOMBRE_REPRESENTANTE) ?? ''} ${(vista.rows[0].APELLIDO_REPRESENTANTE) ?? ''}`,
      telefono_Rep:'',
      email: (vista.rows[0].CORREO_ELECTRONICO_REPRES) ?? '',
      num_Est_VIGIA
    }

    //return "conecto";
  }


}
