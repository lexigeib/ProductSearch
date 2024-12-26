import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import {
  CircularProgress,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Box,
  TextField,
  Slider,
  Drawer,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material'
import Grid from '@mui/material/Grid2';
import StarIcon from '@mui/icons-material/Star';

// barrier that prevents pricing for being less than 10 difference
const minDistance = 10

// products model
type DataItem = {
  category: string,
  description: string,
  id: number,
  image: string,
  price: number,
  rating: { count: number, rate: number },
  title: string,
}

function App() {

  const { isLoading, data, isSuccess } = useQuery({ // call to get data set using tanstack
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('https://fakestoreapi.com/products')
      return res.json()
    },
  })

  const [searchText, setSearchText] = useState("") // state for search text
  const [priceValue, setPriceValue] = React.useState<number[]>([0, 300]) // price filter min, max + default values
  const [categories, setCategories] = useState<any[]>([]); // unique categories state
  const [categoryFilteredSet, setCategoryFilteredSet] = useState(data) // object for data objects filtered by selected categories


  // data set of filtered items. if categories exist, use category filtered set, otherwise filter off original data set. 
  const filteredData = (!isLoading && isSuccess) ? categoryFilteredSet && categoryFilteredSet.length > 0 ? categoryFilteredSet.filter((el: any) => {
    return el.title.toLowerCase().includes(searchText) && el.price <= priceValue[1] && el.price >= priceValue[0]
  }) : data.filter((el: any) => {
    return el.title.toLowerCase().includes(searchText) && el.price <= priceValue[1] && el.price >= priceValue[0]
  }) : []

  useEffect(() => { // if call for products is successful and no longer loading, find unique category names and alphabetize
    if (isSuccess && !isLoading) {
      const tempCategories: any = [];
      data.map((item: any) => {
        const filter = tempCategories.filter((category: any) => category.title === item.category)
        if (filter.length === 0) {
          tempCategories.push({ title: item.category, value: false })
        }
      });
      tempCategories.sort((a: any, b: any) => a.title.localeCompare(b.title))
      setCategories(tempCategories)
    }
  }, [isLoading, isSuccess, data])


  // component to find and highlight searched term.
  const Highlighted = ({ text = '', highlight = '' }) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return <span> {parts.map((part, i) =>
      <span key={i} style={part.toLowerCase() === highlight.toLowerCase() ? { fontWeight: 'bold' } : {}}>
        {part}
      </span>)
    } </span>
  }

  // handles slider for price with max min and barrier for difference
  const handlePriceChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setPriceValue([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setPriceValue([clamped - minDistance, clamped]);
      }
    } else {
      setPriceValue(newValue as number[]);
    }
  };

  // handles category click. changes value of item (true, false) and updates filtered categories object for item filtering
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filteredCategories = categories.filter((item) => item.title !== event.target.name)
    filteredCategories.push({ title: event.target.name, value: event.target.checked })
    filteredCategories.sort((a, b) => a.title.localeCompare(b.title))
    setCategories(filteredCategories)
    let categoryFilteredTemp: any = []
    filteredCategories.map((category: any) => {
      if (category.value) {
        data.forEach((element: any) => {
          if (element.category === category.title) categoryFilteredTemp.push(element)
        });
      }
    })
    setCategoryFilteredSet(categoryFilteredTemp)
  };

  return (
    <>
      {isLoading ? (
        <Box sx={{ width: '100%', paddingTop: 20, justifyContent: 'center', alignContent: 'center', display: 'flex' }}>
          <React.Fragment>
            <svg width={0} height={0}>
              <defs>
                <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e01cd5" />
                  <stop offset="100%" stopColor="#1CB5E0" />
                </linearGradient>
              </defs>
            </svg>
            <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
          </React.Fragment>
        </Box>
      ) : (
        <>
          <div>
            <Drawer variant='permanent'
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260 },
              }}
              open
            >
              <Box sx={{ padding: '20px' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Filter By</Typography>
                <Box sx={{ marginBottom: 5 }}>
                  <Typography sx={{ textDecoration: 'underline', marginBottom: 2 }}>Price</Typography>
                  <Slider
                    max={200}
                    value={priceValue}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    disableSwap
                  />
                </Box>
                <FormControl component="fieldset">
                  <Typography sx={{ textDecoration: 'underline', marginBottom: 2 }}>Category</Typography>
                  <FormGroup aria-label="position">
                    {categories && categories.map((category: any) => (
                      <FormControlLabel
                        value="end"
                        control={<Checkbox name={category.title} />}
                        label={category.title.toUpperCase()}
                        onChange={handleCategoryChange}
                        labelPlacement="end"
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Box>
            </Drawer>
          </div>
          <Box sx={{ paddingX: 30, paddingY: 10, marginLeft: 5, width: { sm: `calc(100% - 300px)` } }}>
            <Box sx={{ paddingBottom: 10, alignItems: 'center' }}>
              <Grid container spacing={2} alignItems={'center'} justifyContent={'center'}>
                <Grid size={10} alignItems={'center'}>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    fullWidth
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      var lowerCase = e.target.value.toLowerCase() // convert to lowercase
                      setSearchText(lowerCase) // save to state
                    }}
                    label="Search"
                  />
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} alignItems={'stretch'}>
              {filteredData.map((item: DataItem) => (
                <Grid size={4} display={'flex'}>
                  <Card sx={{ width: '100%' }}>
                    <CardHeader
                      title={<Highlighted text={item.title} highlight={searchText} />}
                      subheader={item.description}
                    />
                    <CardMedia
                      component="img"
                      height="194"
                      image={item.image}
                    />
                    <CardContent>
                      <Box alignItems={'center'} flexDirection={'row'} display={'flex'} justifyContent={'space-between'}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          ${Number(item.price).toFixed(2)}
                        </Typography>
                        <Box display={'flex'}>
                          <StarIcon sx={{ color: 'yellow' }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {item.rating.rate} ({item.rating.count})
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </>
  )
}

export default App;
