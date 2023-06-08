import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const oracledb = require('oracledb');

export default class JsonVistasController {
  
  public async  index(ctx: HttpContextContract) {
   const { documento } = ctx.request.all()
   let connection
   try {
     oracledb.initOracleClient();
     
         connection = await oracledb.getConnection({
             user          : "USU_CONSULTA",
             password      : "USU_CONSULTA2023",  // contains the hr schema password
             connectString : "172.16.2.55:1521/VIGIAPRO.supertransporte.local",
             encoding : 'UTF-8'
           
         });
    
   } catch (error) {
    return ctx.response.status(500).send({
      mensaje: `Error de conexión a vista`,
      error: 4
    })
   }




    let consulta="select * from vigia.VW_INFORMACION_VIGILADO where NUMERO_DOCUMENTO='"+documento+"'";
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
  
  if(vista.rows.length <= 0) {
    return ctx.response.status(400).send({
      mensaje: `No se encontraron datos del vigilado`,
      error: 2
    })
  }

    return {
         
        numeroDocumento:(vista.rows[0].NUMERO_DOCUMENTO)??'',
        razonSocial:(vista.rows[0].RAZON_SOCIAL)??'',
        correoElectronico:(vista.rows[0].CORREO_ELECTRONICO)??'',
        correoPrincipalNotificacion:(vista.rows[0].CORREO_PRINCIPAL_NOTIFICACION)??'',
        correoOpcionalNotificacion:(vista.rows[0].CORREO_OPCIONAL_NOTIFICACION)??'',
        vigilado:(vista.rows[0].VIGILADO)??'',
        direccion:(vista.rows[0].DIRECCION)??'',
        telefono:(vista.rows[0].TELEFONO)??'',
        numeroFax:(vista.rows[0].NUMERO_FAX)??'',
        direccionNotificacion:(vista.rows[0].DIRECCION_NOTIFICACION)??'',
        idMunicipio:(vista.rows[0].ID_MUNICIPIO)??'',
        nombreMunicipio:(vista.rows[0].NOMBRE_MUNICIPIO)??'',
        idDepartamento:(vista.rows[0].ID_DEPARTAMENTO)??'',
        nombreDepto:(vista.rows[0].NOMBRE_DEPTO)??'',
        tipoDocRepLegal:(vista.rows[0].TIPO_DOC_REP_LEGAL)??'',
        numeroDocuRepresentante:(vista.rows[0].NUMERO_DOCU_REPRESENTANTE)??'',
        nombreRepresentante:(vista.rows[0].NOMBRE_REPRESENTANTE)??'',
        apellidoRepresentante:(vista.rows[0].APELLIDO_REPRESENTANTE)??'',
        correoElectronicoRepres:(vista.rows[0].CORREO_ELECTRONICO_REPRES)??'',
        telefonoVigilado:(vista.rows[0].TELEFONO_VIGILADO)??'',

    }
    
    //return "conecto";
}


}
