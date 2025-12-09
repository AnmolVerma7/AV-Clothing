import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

interface FilterBarProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  filterSizes: string[];
  toggleSize: (size: string) => void;
  filterColors: string[];
  toggleColor: (color: string) => void;
  sizes: string[];
  colors: string[];
  clearFilters: () => void;
}

export const FilterBar = ({
  sortBy,
  setSortBy,
  filterSizes,
  toggleSize,
  filterColors,
  toggleColor,
  sizes,
  colors,
  clearFilters,
}: FilterBarProps) => {
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Grid container spacing={3} alignItems="center">
        {/* Sort By */}
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="default">Featured</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="name-asc">Name: A-Z</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Size Filter */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Size
            </Typography>
            <FormGroup row>
              {sizes.map((size) => (
                <FormControlLabel
                  key={size}
                  control={
                    <Checkbox
                      checked={filterSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                      size="small"
                    />
                  }
                  label={size}
                />
              ))}
            </FormGroup>
          </Box>
        </Grid>

        {/* Color Filter */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Color
            </Typography>
            <FormGroup row>
              {colors.slice(0, 5).map((color) => (
                <FormControlLabel
                  key={color}
                  control={
                    <Checkbox
                      checked={filterColors.includes(color)}
                      onChange={() => toggleColor(color)}
                      size="small"
                    />
                  }
                  label={color}
                />
              ))}
            </FormGroup>
          </Box>
        </Grid>

        {/* Clear Filters */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Button onClick={clearFilters} variant="contained" color="secondary" fullWidth>
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
