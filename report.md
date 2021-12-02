# Data Visualization Final Project Report

## Childhood Environment and Gender Gaps in Adulthood
By Alana Mittleman, Rob Lambeth, Priya Jain, and Tammy Zhou

## Introduction

The gender pay gap is a well known phenomenon in the modern world. The trend is generally understood to be that men make more money than women working in the same position. Research shows that there are factors related to childhood environments that shape the gender pay gap certain populations experience in adulthood. 

These issues of equality have the potential to impact our everyday lives, so we set out to make the results of research in this area more accessible to readers. By choosing the narrative track, we hoped to provide readers with a new way to experience information that was previously locked behind the doors of hard to understand academic journal language. 

## Related Work

There is a substantial amount of research showing that the gender pay gap between men and women exists  (e.g., Altonji and Blank 1999, Blau and Kahn 2000, Goldin, Katz and Kuziemko 2006, Goldin 2014). Even more work has been done to discover potential root causes of the gender wage gap  (Alexander, Entwisle and Olson 2007, DiPrete and Jennings 2012, Bertrand and Pan 2013). These works show significant differences between men and women in many financial success metrics such as income and employment. It is widely accepted that much of this stems from discrimination, and there are also arguments related to differences in family growth patterns between men and women, and occupational preference. Further investigation shows that earlier predictors such as childhood environment and socioeconomic status affect men and women differently in those same financial success metrics. Specifically, men are more negatively impacted than women by detrimental childhood environments.

In 2016, a study was published titled ‘Childhood Environment and Gender Gaps in Adulthood’ based on tax records for tens of thousands of children born in the 1980’s (Chetty, Raj, et al. "Childhood environment and gender gaps in adulthood." American Economic Review). This paper had three major findings that have everyday implications in our lives. First, gender gaps in employment rates, earnings, and college attendance vary substantially across parental income distribution. Specifically, The traditional gender gap in employment rates is reversed for children growing up in poor families: boys in families in the bottom quintile of the income distribution are less likely to work than girls. These gender gaps vary substantially across counties and commuting zones. The outcome variation is also largest for boys growing up in poor, single-parent families. Finally, spatial variation in gender gaps is highly correlated with proxies for neighborhood disadvantage. Low-income boys who grow up in high-poverty, high-minority areas work significantly less than girls. These areas also have higher rates of crime, suggesting that boys growing up in concentrated poverty substitute from formal employment to crime.

For our article, we chose to focus on the first and most interesting finding, that the gender gap is reversed for people who grew up in poverty. This finding subverts most people's knowledge of the issue of equal pay. The overall implication of this research is that gender gaps in adulthood are influenced by factors that affect us in childhood.


## Methods

**Data Cleaning:** From the researchers of the 2016 study discussed earlier, we got three files of data. One at the national level, one at the city level, and one at the commuting zone level. We used documentation provided by the researchers to learn when each of the variables correspond to, grouping columns into two main categories; w2 variables and covariates. Since success as measured by income is the outcome of the research, the w2 columns were considered dependent variables. We filtered these to include only columns that refer to the individual whose family history information is included, not for example their spouse. We filtered the covariates by hand as well after discussing which we might want to include in our analysis. For readability, we also rounded the final versions of our data.

The most pressing issue with the data was getting to a form where we could plot data on a map considering that we did not have a way of creating city and commuting zone boundaries. This essentially meant that we needed to aggregate the data to a state level. For this we drew from the by commuting zone data, and aggregated the rows by state weighting values from each commuting zone by that commuting zone’s population. 

At this point, we had income information for each gender in each income quintile in each state. We created new variables to directly view the gender gap.

**Narrative and Scrollytelling:** We wanted to implement a scrollytelling layout, where the user scrolled through the page, the visualizations and content transitioned using animation. For the map we created an update function in D3.js that would make a gray fill over the map, bring in the bubble map with a transition effect, and update the legend. This function was called with an onscroll event in the html. For the second section, we put the second scatterplot’s div on top of the first scatterplot by making the first scatterplot opaque once there is a scroll event. For the circle comparisons in the third section, we used essentially the same method to create the animation for the circle size.


## Results

In developing a new way for readers to learn about this research, we were able to achieve many of our original objectives. One of our goals was to create a more meaningful impact on the reader than the original paper did. By implementing interactivity we aimed to help users connect with the article content more. This goal was definitely achieved through the scrollytelling medium. As readers scroll, they immediately see the visualizations change. In this way as they scroll the content they read is directly related to the visualization they are seeing. I think this type of progressive disclosure helps readers connect with the content. 

Moreover, seeing animations (as shown in the second and third sections) creates a more effective impression and emotional impact on the reader. When users see the circles grow to different sizes in real time, this information sticks with them better because instead of just reading about it, they are visually experiencing the data and information.


## Discussion

Our final article consists of three sections of increasing specificity. To tell the story of the gender wage gap in relation to childhood environments, we started with an overview of both ends of this issue on a national level. 

**Map Visualizations:** The first section of our article answers the question of what the relationship is between financial inequality in each state and gender gap in positive income rate. The measure used for financial inequality is the Theil index. The Theil index measures an entropic "distance" the population is away from the "ideal" egalitarian state of everyone having the same income. The numerical result is in terms of negative entropy so that a higher number indicates more order that is further away from the "ideal" of maximum disorder. Formulating the index to represent negative entropy instead of entropy allows it to be a measure of inequality rather than equality.

The measure of gender gap in positive income rate is calculated from the difference in the proportion of males vs. females who report positive income on their w2 at the age of 30, averaged across all parental income levels. This was a statistic we calculated from the dataset provided by the researchers. 

The reader first sees a choropleth map weighted by the Theil index, giving them an understanding of the landscape of financial inequality in the US. Upon scrolling, this map transitions into a bubble map showing gender inequality weighted by population. The reader can switch between these two views, seeing that some states with higher inequality also have a larger population or a larger gender gap. These key insights are detailed in the accompanying text. 

**Scatterplots:** After learning about how these issues manifest on a national level, the reader will see a scatterplot of people born in the 1980’s wages against their parents income percentile. The first scatterplot they see shows that across all parent income levels, female offspring make consistently less than male offspring. This is a good overall visualization as it shows how prevalent and ubiquitous the income gender gap is and how it relates to parental income percentile. The second scatterplot shows readers a different representation of the gender gap. Instead of plotting wages, now the y-axis shows percent employed. 


**Case Study:** Finally, in the third section, the case study, our article briefly zooms in on this topic at the state level. The objective of the case study section is to show that differences between state gender gaps in employment correlate strongly with commonly accepted proxies for neighborhood disadvantage across those states, for example local high school dropout rate and fraction of the population made up by black citizens. The original research made this argument much later in the report, and it did so as a secondary point packed into one dense slide. Our aim here was to increase the focus on this correlation — raising the perceived importance of the role of neighborhood disadvantage in employment gender gap to equal with that of the gender gap’s existence overall. It’s worth noting that in this instance, we are trading exhaustiveness for brevity in order to make the point succinctly. The original research’s authors would surely argue for the value of their original presentation of *all* correlated location-specific factors — and for their audience we would agree. However, we took this as an exercise in visualization for a particular audience’s needs, and felt that for our intended lay reader it was safer and smarter to make our argument with a smaller set of clear examples.


## Future Work

Based on our overview of scroller articles, we believe that more advanced and fluid transitions would make reading this article more immersive and meaningful.

**Readability:** To make the bubble map plot more readable, we would want to adjust the color scale of the bubbles to match the true zero in the dataset, which is 0 in proportion to the positive incoming between male and female. 

**Responsiveness:** The current website is not yet responsive and only works well with desktop full screen view. Moving forward, we hope to use frameworks like bootstrap or skeleton to make the article responsive on different devices and screen sizes. Ideally, we would also optimize the interactivity on mobile devices to account for touching interactions. 

**Accessibility:** The article text is currently accessible with a high contrast ratio and appropriate font size, and all the colors are chosen with accessibility for people with visual impairment in mind. However, the interactive visualizations components are not yet accessible with hovering and scrolling interactions. For future works, we hope to make the visualizations accessible for people who use screen readers. 

## References

Altonji, Joseph G., and Rebecca M. Blank. "Race and gender in the labor market." Handbook of labor economics 3 (1999): 3143-3259. https://www.sciencedirect.com/science/article/pii/S1573446399300390 

Bertrand, Marianne, and Jessica Pan. "The trouble with boys: Social influences and the gender gap in disruptive behavior." American economic journal: applied economics 5.1 (2013): 32-64. https://www.aeaweb.org/aej-applied/accepted_single.php?id=941&jrnl=app 

Blau, Francine D., and Lawrence M. Kahn. "Gender differences in pay." Journal of Economic perspectives 14.4 (2000): 75-99. https://www.aeaweb.org/articles?id=10.1257/jep.14.4.75 


Chetty, Raj, et al. "Childhood environment and gender gaps in adulthood." American Economic Review 106.5 (2016): 282-88. https://opportunityinsights.org/wp-content/uploads/2018/03/gender_paper.pdf 

Childhood and Gender Gaps: Commuting Zone Employment Rates by Gender and Parent Income Quintile and Other Covariates. Opportunity Insights. https://opportunityinsights.org/data/?geographic_level=0&topic=0&paper_id=557#resource-listing 


DiPrete, Thomas A., and Jennifer L. Jennings. "Social and behavioral skills and the gender gap in early educational achievement." Social Science Research 41.1 (2012): 1-15. https://www.sciencedirect.com/science/article/pii/S0049089X11001402 

Entwisle, Doris R., et al. “Early Schooling: The Handicap of Being Poor and Male.” Sociology of Education, vol. 80, no. 2, Apr. 2007, pp. 114–138, doi:10.1177/003804070708000202. https://journals.sagepub.com/doi/10.1177/003804070708000202 

Goldin, Claudia, Lawrence F. Katz, and Ilyana Kuziemko. 2006. "The Homecoming of American College Women: The Reversal of the College Gender Gap." Journal of Economic Perspectives, 20 (4): 133-156. https://www.aeaweb.org/articles?id=10.1257/jep.20.4.133 

Goldin, Claudia. "A grand gender convergence: Its last chapter." American Economic Review 104.4 (2014): 1091-1119. https://www.aeaweb.org/articles?id=10.1257/aer.104.4.1091 






