const TextileEngine = {

  // 1. Convert Yarn Count into Tex
  toTex(count, system) {
    count = Number(count);

    if (!Number.isFinite(count) || count <= 0) {
      throw new Error("Invalid yarn count");
    }

    switch (system) {
      case "Ne":
        return 590.5 / count;

      case "Tex":
        return count;

      case "Denier":
        return count / 9;

      case "Nm":
        return 1000 / count;

      default:
        throw new Error("Unknown count system");
    }
  },

  // 2. Calculate Expected Fabric GSM and GLM
  calculate(data) {

    const warpTex = this.toTex(
      data.warpCount,
      data.warpSystem
    );

    const weftTex = this.toTex(
      data.weftCount,
      data.weftSystem
    );

    const warpGSM =
      data.epi * warpTex * 0.0393701 *
      (1 + data.warpCrimp / 100);

    const weftGSM =
      data.ppi * weftTex * 0.0393701 *
      (1 + data.weftCrimp / 100);

    const totalGSM = warpGSM + weftGSM;

    const glm =
      totalGSM * data.widthInch * 0.0254;

    return {
      warpTex,
      weftTex,
      warpGSM,
      weftGSM,
      totalGSM,
      glm
    };
  },

  // 3. Actual GSM from sample
  actualGSM(weightGram, areaM2) {
    return weightGram / areaM2;
  },

  // 4. Actual GLM from roll
  actualGLM(weightKg, lengthMeter) {
    return (weightKg * 1000) / lengthMeter;
  },

  // 5. Expected vs Actual comparison
  compare(expected, actual) {
    return {
      difference: actual - expected,
      differencePercent:
        ((actual - expected) / expected) * 100
    };
  }
};

window.TextileEngine = TextileEngine;

