
import java.io.File;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

public class OneOffProcess {
    Calendar date = Calendar.getInstance(TimeZone.getTimeZone("GMT + 10"));
    Calendar tomorrow = Calendar.getInstance(TimeZone.getTimeZone("GMT + 10"));

    public OneOffProcess() {
        tomorrow.add(Calendar.DAY_OF_YEAR, 1);

    }

    public void downloadMenus() {
        String filePath = new File("").getAbsolutePath();

        File todayOut = new File(
                filePath + "\\public\\Todays_Feed.pdf");

        File tomorrowOut = new File(
                filePath + "\\public\\Tomorrows_Feed.pdf");

        // getting calendar values
        int day = date.get(Calendar.DAY_OF_MONTH);
        int year = date.get(Calendar.YEAR);
        int monthInt = date.get(Calendar.MONTH) + 1;
        String month = String.format("%02d", monthInt);

        // getting tomorrows values
        int yearTomorrow = tomorrow.get(Calendar.YEAR);
        int monthIntTomorrow = tomorrow.get(Calendar.MONTH) + 1;
        String monthTomorrow = String.format("%02d", monthIntTomorrow);
        int dayTomorrowInt = tomorrow.get(Calendar.DAY_OF_MONTH);
        String dayTomorrow = String.format("%02d", dayTomorrowInt);
        String currentDayString = String.format("%02d", day);

        // if current day has changed, download new menus

        System.out.println(currentDayString);
        String linkToday = "https://students.standrewscollege.edu.au/wp-content/uploads/" + year + "/" +
                month + "/"
                + currentDayString + month + "22" + ".pdf";

        new Thread(new Download(linkToday, todayOut)).start();

        String linkTomorrow = "https://students.standrewscollege.edu.au/wp-content/uploads/" + yearTomorrow + "/"
                + monthTomorrow + "/" + dayTomorrow + monthTomorrow + "22" + ".pdf";

        try {
            new Thread(new Download(linkTomorrow, tomorrowOut)).start();

        } catch (Exception e) {
            System.out.println("Error locating URL");
        }

    }

    public static void main(String[] args) {
        OneOffProcess main = new OneOffProcess();
        /* main.updateMenus(); */
        main.downloadMenus();

    }
}
