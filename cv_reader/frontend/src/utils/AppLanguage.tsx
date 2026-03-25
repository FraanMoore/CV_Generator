import { InputLabel, MenuItem, Select } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "../i18n";

const AppLanguage = () => {
    const { i18n, t } = useTranslation();
    const currentLang = i18n.language || "en";

    const handleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        i18n.changeLanguage(value);
    };

    return (
        <FormControl size="small">
            <InputLabel id="app-language-select-label">{t("Language")}</InputLabel>
            <Select
                labelId="app-language-select-label"
                id="app-language-select"
                value={currentLang}
                label={t("Language")}
                onChange={handleChange}
            >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Español</MenuItem>
            </Select>

        </FormControl>
    );
};

export default AppLanguage;