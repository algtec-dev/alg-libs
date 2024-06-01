<template>
  <v-dialog
    v-model="dialogState"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
    max-width="600"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <v-card class="flexcard">
      <v-form>
        <v-card-title class="text-h6 primary--background">
          <v-icon dense left color="white">mdi-note-text</v-icon>
          <span>Relatórios</span>
        </v-card-title>

        <v-card-text class="grow">
          <v-form ref="form">
            <v-row>
              <v-col cols="12" class="mt-3 pb-0">
                <span>
                  Os itens do relatório correspondem aos filtros e ordenações
                  utilizados na lista.
                </span>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-text-field
                  v-model="form.titulo"
                  label="Título do Relatório"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-autocomplete
                  multiple
                  label="Campos para exibição"
                  v-model="form.exibicao"
                  :items="value"
                  hide-details="auto"
                  :rules="arrayRule"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-radio-group
                  label="Tipo de Relatório"
                  v-model="form.tipo"
                  row
                  class="ma-1"
                  :rules="boolRule"
                  hide-details="auto"
                >
                  <v-radio label=".csv (Excel)" :value="'csv'"></v-radio>
                  <v-radio label=".pdf" :value="'pdf'"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" v-if="form.tipo == 'pdf'">
                <v-radio-group
                  label="Orientação"
                  v-model="form.orientacao"
                  row
                  class="ma-1"
                  :rules="boolRule"
                  hide-details="auto"
                >
                  <v-radio label="Retrato" :value="'portrait'"></v-radio>
                  <v-radio label="Paisagem" :value="'landscape'"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" depressed @click="closeDialog()">
            Fechar
          </v-btn>
          <v-btn color="primary" depressed @click="print"> Gerar </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
  
<script>
import http from "@/plugins/axios.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import qs from "qs";

export default {
  props: {
    value: Array,
    dialogState: Boolean,
    url: String,
    query: Object,
  },
  created() {
    this.toQuery = JSON.parse(JSON.stringify(this.query));
    this.toQuery.$paginate = false;
    delete this.toQuery.$limit;
    delete this.toQuery.$skip;
  },
  data: () => ({
    notEmptyRule: [(v) => !!v || "Campo Obrigatório"],
    boolRule: [(v) => v != undefined || "Campo Obrigatório"],
    arrayRule: [(v) => !!(v && v.length) || "Campo Obrigatório"],
    toQuery: {},
    form: {
      titulo: "Relatório",
      exibicao: [],
      // tipo: "csv",
    },
    data: [],
  }),
  methods: {
    async print() {
      if (!this.$refs.form.validate()) return;

      try {
        await this.getData();

        if (this.form.tipo == "csv") this.excel();
        else this.pdf();
      } catch (error) {
        // console.log(error);
      }
    },
    async getData() {
      let temp = [];

      try {
        const response = await http.get(this.url, {
          params: this.toQuery,
          paramsSerializer: (params) => {
            return qs.stringify(params, {
              arrayFormat: "brackets",
              encode: false,
            });
          },
        });
        temp = response.data;
        // console.log(temp);
      } catch (error) {
        // console.log(error);
        // this.showError();
      }

      this.data = temp;
    },
    async pdf() {
      try {
        var data = this.data;

        const doc = new jsPDF(this.form.orientacao);

        // var img = new Image();
        // img.src = "assets/docs/header_min.png";
        // var header_position = this.form.orientacao == "portrait" ? 128 : 215;
        // doc.addImage(img, "PNG", header_position, 5);

        doc.text(this.form.titulo, 14, 25);

        autoTable(doc, {
          startY: 28,
          // headStyles: { fillColor: [155, 89, 182] }, // Purple
          body: data,
          columns: this.form.exibicao.map((el) => {
            return { header: el.text, dataKey: el.value };
          }),
        });

        doc.output("dataurlnewwindow", `${this.form.titulo}.pdf`);
      } catch (error) {
        console.log(error);
        // this.showError();
      }
    },

    async excel() {
      var toExport = [];
      var data = this.data;

      try {
        data.forEach((item) => {
          let temp = {};
          this.form.exibicao.forEach((element) => {
            temp[element.text] = item[element.value] ?? "";
          });
          toExport.push(temp);
        });

        let filename = this.form.titulo + ".csv";
        var data = [];
        var rows = toExport;
        data.push(this.form.exibicao.map((el) => el.text).join(";"));
        for (var i = 0; i < rows.length; i++) {
          var row = [],
            cols = rows[i];
          let values = Object.values(cols);
          for (var j = 0; j < values.length; j++) {
            row.push(values[j]);
          }
          data.push(row.join(";"));
        }
        var csv_file, download_link;
        csv_file = new Blob(["\ufeff", data.join("\n")], {
          type: "text/csv",
        });
        download_link = document.createElement("a");
        download_link.download = filename;
        download_link.href = window.URL.createObjectURL(csv_file);
        download_link.style.display = "none";
        document.body.appendChild(download_link);
        download_link.click();
      } catch (error) {
        // this.showError();
      }
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
};
</script>
  
  <style>
.flexcard {
  display: flex;
  flex-direction: column;
}

.v-input--is-readonly > .v-input__control > .v-input__slot:before {
  border-style: none !important;
}

.v-input--is-readonly > .v-input__control > .v-input__slot:after {
  border-style: none !important;
}
.v-input--is-readonly label.v-label.v-label--active {
  color: var(--v-primary-base) !important;
}
</style>