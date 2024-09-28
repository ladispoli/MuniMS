/**
 * comuni service
 */

const comuniApiUrl = process.env.COMUNI_API_URL || undefined;

export default () => ({
  async findComuni() {
    try {
      if (!comuniApiUrl) {
        throw new Error("Comuni API URL not found");
      }
      const entries = await fetch(comuniApiUrl + "/comuni")
        .then((res) => res.json())
        .then((data) => data);

      if (entries && Array.isArray(entries)) {
        return entries;
      }
      return [];
    } catch (err) {
      return err;
    }
  },

  async findProvince() {
    try {
      if (comuniApiUrl) {
        const entries = await fetch(comuniApiUrl + "/province")
          .then((res) => res.json())
          .then((data) => data);

        if (entries && Array.isArray(entries)) {
          return entries;
        }
        return [];
      }

      throw new Error("Comuni API URL not found");
    } catch (err) {
      return err;
    }
  },

  async findRegioni() {
    try {
      if (comuniApiUrl) {
        const entries = await fetch(comuniApiUrl + "/regioni")
          .then((res) => res.json())
          .then((data) => data);

        if (entries && Array.isArray(entries)) {
          return entries;
        }
        return [];
      }

      throw new Error("Comuni API URL not found");
    } catch (err) {
      return err;
    }
  },
});
