<template>
  <v-container>
    <v-layout wrap>
      <v-flex>
        <v-card elevation="4" light tag="section">
          <v-card-title>
            <v-layout align-center justify-space-between>
              <h3 class="headline">AQI CALCULATOR</h3>
            </v-layout>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <h4>Concentration to AQI Calculator</h4>
            <p class="font-italic">
              DIRECTIONS: Select a pollutant, then enter the Concentration
              value. Click on “Calculate” to see the results.
            </p>
            <v-form ref="form" lazy-validation>
              <v-row>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-select
                    :items="pollutantList"
                    item-text="name"
                    item-value="value"
                    v-model="pollutant"
                    @change="findPollutant"
                    label="Select a Pollutant"
                    dense
                    :rules="[(v) => !!v || 'Select a polutant']"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6"></v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="concentrationValue"
                    type="number"
                    label="Enter the concentration"
                    :suffix="pollutantUnits"
                    :rules="[(v) => !!v || 'Enter the corresponding value']"
                    required
                  />
                </v-col>
                <v-col cols="6"></v-col>
                <v-col cols="2" v-if="displayResult">
                  <h3 class="pt-6 font-weight-bold">Resulting AQI:</h3>
                </v-col>
                <v-col cols="3" v-if="displayResult">
                  <v-text-field v-model="aqiResult" readonly />
                </v-col>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
                <v-col cols="12" md="4">
                  <v-btn
                    x-large
                    block
                    @click="submitData"
                    :loading="watingServerResponse"
                    :disabled="watingServerResponse"
                    color="blue-grey"
                    class="ma-2 white--text"
                  >
                    Save & Calculate
                    <v-icon right dark> mdi-cloud-upload </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn
                    x-large
                    block
                    color="grey"
                    @click="resetValues"
                    :disabled="watingServerResponse"
                    class="ma-2 white--text"
                  >
                    Reset
                  </v-btn>
                </v-col>
              </v-row>
              <!--<v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="loginEmail"
                    :rules="loginEmailRules"
                    label="E-mail"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="loginPassword"
                    :append-icon="show1 ? 'eye' : 'eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Password"
                    hint="At least 8 characters"
                    counter
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6" xsm="12"> </v-col>
                <v-spacer></v-spacer>
                <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                  <v-btn
                    x-large
                    block
                    :disabled="!valid"
                    color="success"
                    @click="validate"
                  >
                    Login
                  </v-btn>
                </v-col>
              </v-row>-->
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <!-- <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
            <v-btn color="info" flat> Forgot password? </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="info" :large="$vuetify.breakpoint.smAndUp">
              <v-icon left>lock</v-icon>
              Login
            </v-btn>
          </v-card-actions> -->
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { aqiService } from "../../services/aqi.service";

export default {
  data() {
    return {
      valid: true,
      pollutantList: [
        {
          name: "PM2.5 - Particulate <2.5 microns (24hr avg)",
          value: "pm2.5",
          units: "ug/m3",
        },
        {
          name: "PM10 - Particulate <10 microns (24hr avg)",
          value: "pm10",
          units: "ug/m3",
        },
        {
          name: "CO - Carbon Monoxide(8hr avg)",
          value: "co",
          units: "ppm",
        },
        {
          name: "SO2 - Sulfar Dioxide (1hr avg)",
          value: "so2-1h",
          units: "ppb",
        },
        {
          name: "SO2 - Sulfar Dioxide (24hr avg)",
          value: "s02-24h",
          units: "ppb",
        },
        {
          name: "O3 - Ozone (1hr avg)",
          value: "o3-1h",
          units: "ppb",
        },
        {
          name: "O3 - Ozone (8hr avg)",
          value: "o3-8h",
          units: "ppb",
        },

        {
          name: "NO2 - Nitrogen Dioxide (1hr avg)",
          value: "no2",
          units: "ppb",
        },
      ],
      pollutant: "",
      pollutantUnits: "",
      concentrationValue: null,
      aqiResult: null,
      watingServerResponse: false,
    };
  },

  computed: {
    displayResult() {
      if (this.aqiResult) return true;
      return false;
    },
  },

  methods: {
    findPollutant() {
      if (this.pollutant.length == 0) {
        this.pollutantUnits = "";
      }
      this.pollutantUnits =
        "unit in " +
        this.pollutantList[
          this.pollutantList.findIndex((item) => item.value === this.pollutant)
        ].units.toString();
    },

    submitData() {
      if (this.$refs.form.validate()) {
        this.aqiResult = true;
        this.watingServerResponse = true;
        let data = {
          pollutantName: this.pollutant,
          pollutantValue: this.concentrationValue,
        };

        aqiService.postData(data).then((res) => {
          console.log(res);
          this.aqiResult = 25;
        });
      }
    },

    resetValues() {
      this.pollutantUnits = "";
      this.$refs.form.reset();
    },
  },
};
</script>