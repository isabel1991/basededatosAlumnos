import { Component, OnInit } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { FirestoreService } from '../firestore.service';
import { Router } from "@angular/router";


@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {

  id = null;
  alumnadoEditando=null;
  
  document: any = {
    id: "",
    data: {} as Alumnado
  };
  constructor(private activatedRoute: ActivatedRoute,private firestoreService: FirestoreService, private router:Router) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.firestoreService.consultarPorId("alumnados", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Alumnado;
      } 
    });
    
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("alumnados", this.id, this.document.data).then(() => {
      // Actualizar la lista completa
      console.log("Id: " + this.id );
      console.log(this.document.data);
      // Limpiar datos de pantalla
      this.document.data = {} as Alumnado;
      this.router.navigate(["/home/"]);

    })
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("alumnados", this.id).then(() => {
      // Limpiar datos de pantalla
      this.document.data = {} as Alumnado;
      this.router.navigate(["/home/"]);
    })
  }

  clicBotonInsertar() {
    this.firestoreService.insertar("alumnados", this.document.data).then(() => {
      console.log('Alumno/a creada correctamente!');
      this.document.data= {} as Alumnado;
      this.document.data.repetidor=false;
      this.router.navigate(["/home/"]);
    }, (error) => {
      console.error(error);
    });
  }

}


import { NgModule } from "@angular/core";
import { Alumnado } from '../alumnado';


const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", loadChildren: "./home/home.module#HomePageModule" },
  { path: "alumno/:id", loadChildren: "./alumno/alumno.module#AlumnoPageModule" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}