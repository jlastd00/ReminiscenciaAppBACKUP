import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PacienteService } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-nuevo-paciente',
  templateUrl: './nuevo-paciente.component.html',
  styleUrls: ['./nuevo-paciente.component.css']
})
export class NuevoPacienteComponent implements OnInit {

  formDatosPersonales:FormGroup;
  formDiagnosticosYpruebas:FormGroup;
  formHistoriaVida:FormGroup;
  formTerapiasAsociadas:FormGroup;

  foto!: File;

  tieneInstitucion!: boolean;
  institucion!: {};
  direccion!: {};
  diagnosticos:any = [];
  diagnostico_2:boolean = false;
  diagnostico_3:boolean = false;

  listaPruebas: any[] = [];
  prueba2:boolean = false;
  prueba3:boolean = false;

  lugarResidencia2:boolean = false;
  lugarResidencia3:boolean = false;

  estudiosSuperiores:boolean = false;
  estudiosPrimOrSec:boolean = false;

  listaActLaborales:any[] = [];
  actividadLaboral2:boolean = false;
  actividadLaboral3:boolean = false;

  aficion_2:boolean = false;
  aficion_3:boolean = false;
  aficion_4:boolean = false;
  aficion_5:boolean = false;

  constructor(
    private pacienteService: PacienteService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.formDatosPersonales = this.formBuilder.group({
      fechaNacimiento: ['', Validators.required],
      //foto: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      institucionalizado: [false],
      nombreInstitucion: [''],
      localidadInstitucion: [''],
      fechaIngreso: [''],
      nombreVia: [''],
      numero: [''],
      pisoYletra: [''],
      localidad: [''],
      provincia: [''],
    });

    this.formDiagnosticosYpruebas = this.formBuilder.group({
      diagnostico1: ['', Validators.required],
      profesional1: ['', Validators.required],
      fechaDiagnostico1: ['', Validators.required],
      diagnostico2: [''],
      profesional2: [''],
      fechaDiagnostico2: [''],
      diagnostico3: [''],
      profesional3: [''],
      fechaDiagnostico3: [''],
      nombrePrueba1: ['Prueba'],
      fechaPrueba1: [''],
      nombrePrueba2: ['Prueba'],
      fechaPrueba2: [''],
      nombrePrueba3: ['Prueba'],
      fechaPrueba3: [''],
    });

    this.formHistoriaVida = this.formBuilder.group({
      lugarNacimiento: ['', Validators.required],
      fechaDesde1: [''],
      fechaHasta1: [''],
      localidadResidencia1: [''],
      provinciaResidencia1: [''],
      paisResidencia1: [''],
      fechaDesde2: [''],
      fechaHasta2: [''],
      localidadResidencia2: [''],
      provinciaResidencia2: [''],
      paisResidencia2: [''],
      fechaDesde3: [''],
      fechaHasta3: [''],
      localidadResidencia3: [''],
      provinciaResidencia3: [''],
      paisResidencia3: [''],
      nivelEstudios: ['Nivel de estudios', Validators.required],
      institucionEstudios: [''],
      localidadEstudios: [''],
      titulacionEstudios: [''],
      fechaInicioEstudios: [''],
      fechaFinEstudios: [''],
      actividadLaboral1: ['', Validators.required],
      empresaLaboral1: ['', Validators.required],
      localidadLaboral1: ['', Validators.required],
      provinciaLaboral1: ['', Validators.required],
      paisLaboral1: ['', Validators.required],
      fechaInicioLaboral1: ['', Validators.required],
      fechaFinLaboral1: ['', Validators.required],
      actividadLaboral2: [''],
      empresaLaboral2: [''],
      localidadLaboral2: [''],
      provinciaLaboral2: [''],
      paisLaboral2: [''],
      fechaInicioLaboral2: [''],
      fechaFinLaboral2: [''],
      actividadLaboral3: [''],
      empresaLaboral3: [''],
      localidadLaboral3: [''],
      provinciaLaboral3: [''],
      paisLaboral3: [''],
      fechaInicioLaboral3: [''],
      fechaFinLaboral3: [''],
      aficion1: ['', Validators.required],
      aficion2: [''],
      aficion3: [''],
      aficion4: [''],
      aficion5: [''],
    });

    this.formTerapiasAsociadas = this.formBuilder.group({

    });

  }

  /**
    foto: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    nombre: { type: String, required: true },
    apellido1: { type: String, required: true },
    apellido2: { type: String, required: true },
    fechaAlta: { type: Date, default: Date.now() },
    institucionalizado: { type: Boolean, required: true },
    institucion: {
        nombre: String,
        localidad: String,
        fechaIngreso: Date
    },
    direccion: {
        nombreVia: String,
        numero: Number,
        pisoYletra: String,
        localidad: String,
        provincia: String
    },
    diagnostico: { type: String, required: true },
    profesional: { type: String, required: true },
    fechaDiagnostico: { type: Date, required: true },
    valoracionesYpruebas: [{
        nombrePrueba: String,
        fechaPrueba: Date
    }],
    lugarNacimiento: { type: String, required: true },
    lugarResidencia: [{
        fechaDesde: String,
        fechaHasta: String,
        localidad: String,
        provincia: String,
        pais: String
    }],
    nivelEstudios: { type: String, required: true },
    estudios: {
        institucion: String,
        localidad: String,
        fechaInicio: String,
        fechaFin: String,
        titulacion: String
    },
    actividadLaboral: [{
        actividad: String,
        empresa: String,
        localidad: String,
        provincia: String,
        pais: String,
        fechaInicio: String,
        fechaFin: String
    }],
    aficiones: [],
    terapias: [{
        ref: 'Terapia',
        type: Schema.Types.ObjectId
    }]
   */

  ngOnInit(): void {
    this.tieneInstitucion = this.formDatosPersonales.get('institucionalizado')?.value;

    this.pacienteService.obtenerListaPruebas().subscribe(
      res => {
        if (res.resultado === 'ERROR') {
          this.toastr.error(res.mensaje, res.resultado);
        }
        else {
          this.listaPruebas = res.pruebas;
        }
        //console.log(res.pruebas);
      },
      err => {
        console.log(err);
      }
    );

    this.pacienteService.obtenerListaActividadesLaborales().subscribe(
      res => {
        if (res.resultado === 'ERROR') {
          this.toastr.error(res.mensaje, res.resultado);
        }
        else {
          this.listaActLaborales = res.actividades;
        }
        //console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  onFileChange(event: any) {
    /*if (event.target.files.length > 0) {
      this.foto = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.foto);
      console.log(this.foto);
    }*/
  }

  guardarPaciente() {
    //console.log(this.nuevoPaciente);

  }

  /*
  const nuevoPaciente = new Paciente({
        foto: foto,
        fechaNacimiento: fechaNacimiento,
        nombre: nombre,
        apellido1: apellido1,
        apellido2: apellido2,
        fechaAlta: fechaAlta,
        institucionalizado: institucionalizado,
        institucion: institucion,
        direccion: direccion,
        diagnosticos: diagnosticos,
        profesional: profesional,
        fechaDiagnostico: fechaDiagnostico,
        valoracionesYpruebas: valoracionesYpruebas,
        lugarNacimiento: lugarNacimiento,
        lugarResidencia: lugarResidencia,
        nivelEstudios: nivelEstudios,
        estudios: estudios,
        actividadLaboral: actividadLaboral,
        aficiones: aficiones,
        terapias: terapias,
    });
  */

  cambiarInstitucion() {
    //console.log(this.nuevoPaciente.get('institucionalizado')?.value);
    this.tieneInstitucion = this.formDatosPersonales.get('institucionalizado')?.value;
  }

  addDiagnostico() {
    if (!this.diagnostico_2) {
      this.diagnostico_2 = true;
    }
    else if (!this.diagnostico_3) {
      this.diagnostico_3 = true;
    }
    else {
      this.toastr.warning("Solo se pueden introducir los 3 últimos diagnósticos", "Aviso!");
    }
  }

  addPrueba() {
    if (!this.prueba2) {
      if (this.formDiagnosticosYpruebas.get('nombrePrueba1')?.value === 'Prueba') {
        this.toastr.error("Debes seleccionar una prueba para poder añadir otra", "Prueba no seleccionada");
        return;
      }
      this.prueba2 = true;
    }
    else if (!this.prueba3) {
      if (this.formDiagnosticosYpruebas.get('nombrePrueba2')?.value === 'Prueba') {
        this.toastr.error("Debes seleccionar una prueba para poder añadir otra", "Prueba no seleccionada");
        return;
      }
      this.prueba3 = true;
    }
    else {
      this.toastr.warning("Solo se pueden introducir las 3 últimas pruebas", "Aviso!");
    }
  }

  addLugarResidencia() {
    if (!this.lugarResidencia2) {
      this.lugarResidencia2 = true;
    }
    else if (!this.lugarResidencia3) {
      this.lugarResidencia3 = true;
    }
    else {
      this.toastr.warning("Solo se pueden introducir los 3 últimos lugares de residencia", "Aviso!");
    }
  }

  introducirEstudios() {
    if (this.formHistoriaVida.get('nivelEstudios')?.value === 'PRIMARIOS' ||
        this.formHistoriaVida.get('nivelEstudios')?.value === 'SECUNDARIOS/FP') {
      this.estudiosSuperiores = false;
      this.estudiosPrimOrSec = true;
    }
    else if (this.formHistoriaVida.get('nivelEstudios')?.value === 'SUPERIORES') {
      this.estudiosPrimOrSec = false;
      this.estudiosSuperiores = true;
    }
    else {
      this.estudiosPrimOrSec = false;
      this.estudiosSuperiores = false;
      this.toastr.error("Debes seleccionar un tipo de estudios válido", "Tipo estudios incorrecto!");
    }
    return;
  }

  addActividadLaboral() {
    if (!this.actividadLaboral2) {
      this.actividadLaboral2 = true;
    }
    else if (!this.actividadLaboral3) {
      this.actividadLaboral3 = true;
    }
    else {
      this.toastr.warning("Solo se pueden introducir las 3 últimas actividades laborales", "Aviso!");
    }
  }

  addAficion() {
    if (!this.aficion_2) {
      if (this.formHistoriaVida.get('aficion1')?.value === "") {
        this.toastr.error("No puedes añadir una afición si no has escrito la anterior", "Error!");
        return;
      }
      this.aficion_2 = true;
    }
    else if (!this.aficion_3) {
      if (this.formHistoriaVida.get('aficion2')?.value === "") {
        this.toastr.error("No puedes añadir una afición si no has escrito la anterior", "Error!");
        return;
      }
      this.aficion_3 = true;
    }
    else if (!this.aficion_4) {
      if (this.formHistoriaVida.get('aficion3')?.value === "") {
        this.toastr.error("No puedes añadir una afición si no has escrito la anterior", "Error!");
        return;
      }
      this.aficion_4 = true;
    }
    else if (!this.aficion_5) {
      if (this.formHistoriaVida.get('aficion4')?.value === "") {
        this.toastr.error("No puedes añadir una afición si no has escrito la anterior", "Error!");
        return;
      }
      this.aficion_5 = true;
    }
    else {
      if (this.formHistoriaVida.get('aficion5')?.value === "") {
        this.toastr.error("No puedes añadir una afición si no has escrito la anterior", "Error!");
        return;
      }
      this.toastr.warning("Solo se pueden introducir 5 aficiones", "Aviso!");
    }
  }

}
